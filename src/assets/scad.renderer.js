import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

const loader = new STLLoader();
const scene = new THREE.Scene();
const modelCenter = new THREE.Vector3();
const container = document.getElementById("viewer");

const deg2rad = (degrees) => degrees * (Math.PI / 180);

let modelRadius = 1;
let renderer, camera, controls, mesh, material;

const lights = {
	ambient: undefined,
	key: undefined,
	fill: undefined,
	uplight: undefined,
};

//#region Renderer
function setupRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0xffffff, 0);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMappingExposure = 0.7;
	container.appendChild(renderer.domElement);
}
//#endregion

//#region Camera
function setupCamera() {
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

	camera.position.set(1, 1, 1).normalize().multiplyScalar(500);
	scene.add(camera);
}
//#endregion

//#region Controls
function setupControls() {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = false;
}
//#endregion

//#region Lights
function setupLights() {
	lights.ambient = new THREE.AmbientLight(0xffffff, 0.25);

	lights.key = new THREE.DirectionalLight(0xffffff, 0.4);
	lights.fill = new THREE.DirectionalLight(0xffffff, 0.4);
	lights.uplight = new THREE.DirectionalLight(0xffffff, 0.2);

	scene.add(
		lights.ambient,
		lights.key,
		lights.key.target,
		lights.fill,
		lights.fill.target,
		lights.uplight,
		lights.uplight.target
	);
}

// Aim lights relative to model bounds
function aimDirectionalLight(light, direction) {
	const dir = direction.clone().normalize();

	light.position.copy(
		modelCenter.clone().addScaledVector(dir, modelRadius * 3)
	);

	light.target.position.copy(
		modelCenter.clone().addScaledVector(dir, -modelRadius)
	);
}
//#endregion

//#region Resize
function setupResizeHandler() {
	window.addEventListener("resize", () => {
		const w = container.clientWidth;
		const h = container.clientHeight;
		const aspect = w / h;

		renderer.setSize(w, h);

		const frustumHeight = camera.top - camera.bottom;
		camera.left = (-frustumHeight * aspect) / 2;
		camera.right = (frustumHeight * aspect) / 2;

		camera.updateProjectionMatrix();
	});
}
//#endregion

//#region FrameObject
function frameObject(object) {
	const box = new THREE.Box3().setFromObject(object);
	const size = box.getSize(new THREE.Vector3());
	box.getCenter(modelCenter);

	modelRadius = size.length() * 0.5;

	const aspect = container.clientWidth / container.clientHeight;
	const frustumHeight = Math.max(size.x, size.y, size.z) * 2;
	const frustumWidth = frustumHeight * aspect;

	camera.left = -frustumWidth / 2;
	camera.right = frustumWidth / 2;
	camera.top = frustumHeight / 2;
	camera.bottom = -frustumHeight / 2;

	camera.updateProjectionMatrix();
	camera.lookAt(modelCenter);

	controls.target.copy(modelCenter);
	controls.update();
}
//#endregion

//#region Loader
function loadSTL(url) {
	loader.load(url, (geometry) => {
		geometry = BufferGeometryUtils.mergeVertices(geometry, 1e-4);
		geometry.computeBoundingBox();

		const center = new THREE.Vector3();
		geometry.boundingBox.getCenter(center).negate();
		geometry.translate(center.x, center.y, center.z);

		mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(deg2rad(-90));
		mesh.updateMatrixWorld(true);
		geometry.computeVertexNormals();

		scene.add(mesh);

		frameObject(mesh);

		// Model-relative light directions
		aimDirectionalLight(lights.key, new THREE.Vector3(1, 1, 1));
		aimDirectionalLight(lights.fill, new THREE.Vector3(-1, 1, 1));
		aimDirectionalLight(lights.uplight, new THREE.Vector3(0, -1, 1));
	});
}
//#endregion

//#region Animate
function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}
//#endregion

//#region Main
function main(url) {
	material = new THREE.MeshPhongMaterial({
		color: window.MESH_COLOR ?? "#5588FF",
		shininess: 60,
	});

	setupRenderer();
	setupCamera();
	setupControls();
	setupLights();
	setupResizeHandler();
	loadSTL(url);
	animate();
}

main(window.STL_URL);
//#endregion

//#region Typedef
/**
 * @typedef {Object} RenderOptions
 * @property {import("three").Material} [material]
 */
//#endregion
