import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const loader = new STLLoader();
const container = document.getElementById("viewer");
const deg2rad = (degrees) => degrees * (Math.PI / 180);
const lights = {
	key: undefined,
	fill: undefined,
	rim: undefined,
};

let renderer, composer, mesh, material, camera, scene, controls, bloomPass;

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
	renderer.physicallyCorrectLights = true;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.85;

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
	const resolution = new THREE.Vector2(
		container.clientWidth,
		container.clientHeight,
	);
	const renderScene = new RenderPass(scene, camera);
	// const outputPass = new OutputPass();

	bloomPass = new UnrealBloomPass(resolution, strength, radius, threshold);
	composer = new EffectComposer(
		renderer,
		new THREE.WebGLRenderTarget(
			container.clientWidth,
			container.clientHeight,
			{ format: THREE.RGBAFormat }, // alpha channel
		),
	);

	composer.addPass(renderScene);
	// composer.addPass(bloomPass);
	// composer.addPass(outputPass);
}

function setupCameraAndControls() {
	const aspect = container.clientWidth / container.clientHeight;
	const frustumSize = 100;

	camera = new THREE.OrthographicCamera(
		(frustumSize * aspect) / -2,
		(frustumSize * aspect) / 2,
		frustumSize / 2,
		frustumSize / -2,
		0.1,
		5000,
	);

	// camera.position.set(x, y, z);
	// camera.zoom = zoom;
	camera.updateProjectionMatrix();

	controls = new OrbitControls(camera, renderer.domElement);
	// controls.enableDamping = true;
}

function setupScene() {
	scene = new THREE.Scene();

	// Slight ambient so shadows aren’t pure black
	scene.add(new THREE.AmbientLight(0xffffff, 0.25));

	lights.key = new THREE.DirectionalLight(0xffffff, 1.2);
	lights.key.position.set(2, 3, 4);
	scene.add(lights.key);

	lights.fill = new THREE.DirectionalLight(0xffffff, 0.6);
	lights.fill.position.set(-3, 1, 2);
	scene.add(lights.fill);

	lights.rim = new THREE.DirectionalLight(0xffffff, 0.9);
	lights.rim.position.set(0, 3, -4);
	scene.add(lights.rim);
}

/**
 * Load the model into the scene
 *
 * @param {string} stlUrl to the STL model file
 */
function loadSTL(stlUrl) {
	loader.load(stlUrl, (geometry) => {
		const center = new THREE.Vector3();
		// edges highlight / darken
		const edges = new THREE.EdgesGeometry(geometry, 25);
		const lines = new THREE.LineSegments(
			edges,
			new THREE.LineBasicMaterial({ color: 0x111111 }),
		);

		geometry.computeVertexNormals();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center).negate();
		geometry.translate(center.x, center.y, center.z);

		mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(deg2rad(-90));
		mesh.add(lines);

		scene.add(mesh);

		frameObject(mesh, camera, controls, 2);
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

/**
 * Initializes the STL renderer.
 *
 * @param {string} url - URL to the STL file.
 * @param {RenderOptions} state - Renderer configuration options.
 */
function init(url, state) {
	material = state.material;

	setupResizeHandler();
	setupRenderer();
	setupScene();
	setupCameraAndControls();
	setupPostProcessing(state.bloomPass);
	loadSTL(url);
	animate();
}

/**
 * Initialize the three.js renderer with the initial state for the gui
 *
 * `window.STL_URL` is defined in the <head> from the `scad.renderer.js` template
 */
init(window.STL_URL, {
	bloomPass: {
		strength: 1,
		radius: .2,
		threshold: .5
	},
	material: new THREE.MeshStandardMaterial({
		color: 0x5588ff,
		emissive: 0x3366ff,
		emissiveIntensity: 0.1,
		metalness: 0.1,
		roughness: 0.1,
	}),
});

/**
 * @typedef {Object} MaterialProps
 *
 * @property {number} [metalness] - Material metalness value (0 = goop, 1 = titanium).
 * @property {number} [roughness] - Material roughness value (0 = smooth, 1 = rough).
 */

/**
 * @typedef {Object} RenderOptions
 *
 * @property {Object} [bloomPass] - Bloom post-processing configuration.
 * @property {number} [bloomPass.strength] - Intensity of the bloom effect.
 * @property {number} [bloomPass.radius] - Radius of the bloom blur.
 * @property {number} [bloomPass.threshold] - Luminance threshold for bloom activation.
 *
 * @property {import("three").Material} [material] - Material configuration overrides.
 */
