import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const loader = new STLLoader();
const container = document.getElementById("viewer");
const deg2rad = (degrees) => (degrees * (Math.PI / 180));

let renderer,
	composer,
	bloomPass,
	mesh,
	camera,
	spotLight,
	scene,
	controls;

function frameObject(object, camera, controls, fitOffset = 1.2) {
	const box = new THREE.Box3().setFromObject(object);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());

	const maxDim = Math.max(size.x, size.y, size.z);

	const aspect = container.clientWidth / container.clientHeight;
	const frustumHeight = maxDim * fitOffset;
	const frustumWidth = frustumHeight * aspect;

	camera.left = -frustumWidth / 2;
	camera.right = frustumWidth / 2;
	camera.top = frustumHeight / 2;
	camera.bottom = -frustumHeight / 2;

	camera.near = -1000;
	camera.far = 1000;
	camera.updateProjectionMatrix();

	camera.position.set(1, 1, 1).normalize().multiplyScalar(500);
	camera.lookAt(center);

	controls.target.copy(center);
	controls.update();
}

function setupRenderer() {
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setClearColor(0xffffff, 0);

	renderer.autoClear = true;
	renderer.toneMappingExposure = 1.0;
	renderer.physicallyCorrectLights = true;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;

	container.appendChild(renderer.domElement);
}

function setupResizeHandler() {
	window.addEventListener("resize", () => {
		const width = container.clientWidth;
		const height = container.clientHeight;
		const aspect = width / height;

		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);

		const frustumHeight = camera.top - camera.bottom;
		camera.left = (-frustumHeight * aspect) / 2;
		camera.right = (frustumHeight * aspect) / 2;

		camera.updateProjectionMatrix();
		composer.setSize(width, height);
	});
}

function setupPostProcessing({ strength, radius, threshold }) {
	const resolution = new THREE.Vector2(container.clientWidth, container.clientHeight);
	const renderScene = new RenderPass(scene, camera);
	// const outputPass = new OutputPass();

	bloomPass = new UnrealBloomPass(resolution, strength, radius, threshold);
	composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(
		container.clientWidth,
		container.clientHeight,
		{ format: THREE.RGBAFormat } // alpha channel
	));

	composer.addPass(renderScene);
	// composer.addPass(bloomPass);
	// composer.addPass(outputPass);
}

/**
 * Setup initial camera position & orbit controls.
 *
 * @param {Object} options - Configuration object for the initial camera position.
 * @param {number} options.x - The x-coordinate of the camera position.
 * @param {number} options.y - The y-coordinate of the camera position.
 * @param {number} options.z - The z-coordinate of the camera position.
 * @param {number} options.fov - The field of view of the camera
 */
function setupCameraAndControls() {
	const aspect = container.clientWidth / container.clientHeight;
	const frustumSize = 100;

	camera = new THREE.OrthographicCamera(
		(frustumSize * aspect) / -2,
		(frustumSize * aspect) / 2,
		frustumSize / 2,
		frustumSize / -2,
		0.1,
		5000
	);

	// camera.position.set(x, y, z);
	// camera.zoom = zoom;
	camera.updateProjectionMatrix();

	controls = new OrbitControls(camera, renderer.domElement);
	// controls.enableDamping = true;
}

/**
 * Setup the initial spotlight position.
 *
 * @param {Object} options - Configuration object for the initial spotlight position.
 * @param {number} options.x - The x-coordinate of the spotlight position.
 * @param {number} options.y - The y-coordinate of the spotlight position.
 * @param {number} options.z - The z-coordinate of the spotlight position.
 */
function setupScene({ x, y, z }) {
	scene = new THREE.Scene();

	// Slight ambient so shadows aren’t pure black
	scene.add(new THREE.AmbientLight(0xffffff, 0.25));

	const key = new THREE.DirectionalLight(0xffffff, 1.2);
	key.position.set(2, 3, 4);
	scene.add(key);

	const fill = new THREE.DirectionalLight(0xffffff, 0.6);
	fill.position.set(-3, 1, 2);
	scene.add(fill);

	const rim = new THREE.DirectionalLight(0xffffff, 0.9);
	rim.position.set(0, 3, -4);
	scene.add(rim);
}

/**
 * Load the model into the scene
 *
 * @param {string} URL to the STL model file
 */
function loadSTL(stlUrl) {
	// const material = new THREE.MeshPhongMaterial({ color: 0x5588ff });
	const material = new THREE.MeshStandardMaterial({
		color: 0x5588ff,
		emissive: 0x3366ff,
		emissiveIntensity: 0.3,
		metalness: 0.3,
		roughness: 0.2
	});

	loader.load(stlUrl, (geometry) => {
		const center = new THREE.Vector3();

		geometry.computeVertexNormals();
		geometry.computeBoundingBox();
		geometry
			.boundingBox
			.getCenter(center)
			.negate();
		geometry.translate(center.x, center.y, center.z);

		mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(deg2rad(-90));

		scene.add(mesh);

		frameObject(mesh, camera, controls, 2);

		// if (showEdges) {
		// 	// optional: edges overlay for instant readability
		// 	const edges = new THREE.EdgesGeometry(mesh.geometry, 20);
		// 	const line = new THREE.LineSegments(
		// 		edges,
		// 		new THREE.LineBasicMaterial({ color: 0x111111 }),
		// 	);
		// 	mesh.add(line);
		// }
	});
}


function renderScene() {
	// renderer.render(scene, camera);
	composer.render();
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderScene();
}

function setupGUI(initialState) {
	const gui = new GUI();
	// const cameraFolder = gui.addFolder("Camera");
	// const lightingFolder = gui.addFolder("Lighting");
	// const meshFolder = gui.addFolder("Mesh");
	const bloomFolder = gui.addFolder("Bloom");
	const { lightPos, bloomPass } = initialState;
	const set = (target, key) => (value) => { target[key] = Number(value); };

	// gui.onChange((event) => {
	// 	console.log("Saving: %O", gui.save());
	// });

	// meshFolder.addColor(initialState.mesh, "color").onChange(console.log);
	// lightingFolder.add(lightPos, "x", -500, 500, 1).onChange(set(spotLight.position, "x"));
	// lightingFolder.add(lightPos, "y", -500, 500, 1).onChange(set(spotLight.position, "y"));
	// lightingFolder.add(lightPos, "z", -500, 500, 1).onChange(set(spotLight.position, "z"));

	bloomFolder.add(bloomPass, "radius", 0, 1, 0.1).onChange(set(bloomPass, "radius"));
	bloomFolder.add(bloomPass, "strength", 0, 3, 0.1).onChange(set(bloomPass, "strength"));
	bloomFolder.add(bloomPass, "threshold", 0, 1, 0.1).onChange(set(bloomPass, "threshold"));
}

function init() {
	const initialState = {
		// mesh: {
		// 	color: "#ab98fc"
		// },
		lightPos: {
			x: 20,
			y: 50,
			z: 200
		},
		bloomPass: {
			strength: 1,
			radius: .5,
			threshold: .5
		}
	};
	setupRenderer();
	setupScene(initialState.lightPos);
	setupCameraAndControls();
	setupPostProcessing(initialState.bloomPass);
	setupGUI(initialState);
	setupResizeHandler();
	loadSTL(window.STL_URL); // STL_URL is defined in the <head>
	animate();
}

init();
