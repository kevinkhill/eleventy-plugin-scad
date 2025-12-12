import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm";

const loader = new STLLoader();
const container = document.getElementById("viewer");
const deg2rad = (degrees) => degrees * (Math.PI / 180);

let renderer, camera, scene, controls, spotLight;
let composer, bloomPass;

function setupRenderer() {
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setClearColor(0xffffff, 0);

	renderer.physicallyCorrectLights = true;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.0;

	container.appendChild(renderer.domElement);
}

function setupCameraAndControls({ x, y, z }) {
	camera = new THREE.PerspectiveCamera(
		60,
		container.clientWidth / container.clientHeight,
		0.1,
		1000
	);
	camera.position.set(x, y, z);
	controls = new OrbitControls(camera, renderer.domElement);
}

function setupScene({ x, y, z }) {
	scene = new THREE.Scene();

	scene.add(new THREE.AmbientLight(0x888888));

	spotLight = new THREE.DirectionalLight(0xffffff, 1);
	spotLight.position.set(x, y, z);
	scene.add(spotLight);
}

function setupPostProcessing() {
	composer = new EffectComposer(renderer);

	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);

	bloomPass = new UnrealBloomPass(
		new THREE.Vector2(container.clientWidth, container.clientHeight),
		1.2,
		0.4,
		0.85
	);

	composer.addPass(bloomPass);
}

function loadSTL(url) {
	const material = new THREE.MeshStandardMaterial({
		color: 0x5588ff,
		emissive: 0x3366ff,
		emissiveIntensity: 0.6,
		metalness: 0.3,
		roughness: 0.2
	});

	loader.load(url, (geometry) => {
		const center = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center).negate();
		geometry.translate(center.x, center.y, center.z);

		const mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(deg2rad(-90));
		scene.add(mesh);
	});
}

function setupResizeHandler() {
	window.addEventListener("resize", () => {
		const w = container.clientWidth;
		const h = container.clientHeight;

		renderer.setSize(w, h);
		composer.setSize(w, h);

		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	});
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	composer.render();
}

function setupGUI(state) {
	const gui = new GUI();

	const light = gui.addFolder("Light");
	light.add(state.lightPos, "x", -500, 500).onChange(v => {
		spotLight.position.x = v;
	});
	light.add(state.lightPos, "y", -500, 500).onChange(v => {
		spotLight.position.y = v;
	});
	light.add(state.lightPos, "z", -500, 500).onChange(v => {
		spotLight.position.z = v;
	});

	const bloom = gui.addFolder("Bloom");
	bloom.add(bloomPass, "strength", 0, 3, 0.01);
	bloom.add(bloomPass, "radius", 0, 1, 0.01);
	bloom.add(bloomPass, "threshold", 0, 1, 0.01);
}

function init() {
	const initialState = {
		lightPos: { x: 20, y: 50, z: 200 },
		cameraPos: { x: 45, y: 45, z: 45 }
	};

	setupRenderer();
	setupScene(initialState.lightPos);
	setupCameraAndControls(initialState.cameraPos);
	setupPostProcessing();
	setupGUI(initialState);
	loadSTL(window.STL_URL);
	setupResizeHandler();
	animate();
}

init();
