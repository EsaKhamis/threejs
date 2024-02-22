import * as three from 'three';
import './styles.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Debug
 */
const gui = new GUI({
    width: 300,
    title: 'Esa\'s Debug UI',
    closeFolders: false,
});
gui.hide();
// cursor
const cursor = {
	x: 0,
	y: 0,
};

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const debugObject: any = {
    color: '#d67aab',
    subdivions: 3,
};

window.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        gui.show(gui._hidden);
    }
});

window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

window.addEventListener('resize', () => {
    // update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
    const fullscreenElement = document?.fullscreenElement;

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});


/**
 * Textures
 */
const loadingManager = new three.LoadingManager();

const textureLoader = new three.TextureLoader(loadingManager);

const colourTexture = textureLoader.load('/textures/door/color.jpg');
colourTexture.colorSpace = three.SRGBColorSpace;
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('./textures/matcaps/8.png');

const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');

// canvas
const canvas: any = document.querySelector('.webgl');

// scene
const scene: three.Scene = new three.Scene();

// environment map
const rgbeloader = new RGBELoader();
rgbeloader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
	environmentMap.mapping = three.EquirectangularReflectionMapping;
	scene.background = environmentMap;
    scene.environment = environmentMap;
});

// lights
// const ambientLight: three.AmbientLight = new three.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const pointLight: three.PointLight = new three.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// object

const boxGeometry: three.BoxGeometry = new three.BoxGeometry(1, 1, 1, debugObject.subdivions, debugObject.subdivions, debugObject.subdivions);
const sphereGeometry: three.SphereGeometry = new three.SphereGeometry(0.5, 64, 64);
const planeGeometry: three.PlaneGeometry = new three.PlaneGeometry(1, 1, 100, 100);
const taurusGeometry: three.TorusGeometry = new three.TorusGeometry(0.3, 0.2, 64, 128);


// const material: three.MeshBasicMaterial = new three.MeshBasicMaterial();
// const material: three.MeshNormalMaterial = new three.MeshNormalMaterial();
// const material: three.MeshMatcapMaterial = new three.MeshMatcapMaterial();
// const material: any = new three.MeshDepthMaterial();
// const material: three.MeshLambertMaterial = new three.MeshLambertMaterial();
// const material: three.MeshPhongMaterial = new three.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new three.Color('orange');
// const material: three.MeshToonMaterial = new three.MeshToonMaterial();
// gradientTexture.minFilter = three.NearestFilter;
// gradientTexture.magFilter = three.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;
// const material: three.MeshStandardMaterial = new three.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = colourTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = alphaTexture;

const material: three.MeshPhysicalMaterial = new three.MeshPhysicalMaterial();
material.metalness = 1;
material.roughness = 1;
material.map = colourTexture;
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = heightTexture;
material.displacementScale = 0.05;
material.metalnessMap = metalnessTexture;
material.roughnessMap = roughnessTexture;
material.normalMap = normalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = alphaTexture;

// material.clearcoat = 1;
// material.clearcoatRoughness = 1;
// material.sheen =1;
// material.sheenRoughness = 1;   
// material.sheenColor.set(1,1,1);

// gui.add(material, 'sheen').min(0).max(1).step(0.0001);
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001);


// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001);

// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001);
// gui.add(material, 'iridescenceIOR').min(0).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, '0').min(0).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(0).max(1000).step(1);

material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

gui.add(material, 'transmission').min(0).max(1).step(0.0001);
gui.add(material, 'ior').min(0).max(10).step(0.0001);
gui.add(material, 'thickness').min(0).max(1).step(0.0001);

gui.add(material, 'wireframe');
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);

gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);


// material.color = new three.Color('red');
// material.wireframe = true;
// material.flatShading = true;
// material.transparent = true;
// material.map = colourTexture;
// material.alphaMap = alphaTexture;
material.side = three.DoubleSide;
// material.matcap = matcapTexture;

const sphereMesh: three.Mesh = new three.Mesh(sphereGeometry, material);
const planeMesh: three.Mesh = new three.Mesh(planeGeometry, material);
const taurusMesh: three.Mesh = new three.Mesh(taurusGeometry, material);

sphereMesh.position.x = -1.5;
taurusMesh.position.x = 1.5;

scene.add(sphereMesh, planeMesh, taurusMesh);

// camera
// fov should be 45-75
const camera: three.PerspectiveCamera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

camera.position.z = 3;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(sphereMesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();
// renderer
const renderer: three.WebGLRenderer = new three.WebGLRenderer({
	canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

const clock = new three.Clock();

// animation
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    sphereMesh.rotation.y = 0.1 * elapsedTime;
    planeMesh.rotation.y = 0.1 * elapsedTime;
    taurusMesh.rotation.y = 0.1 * elapsedTime;

    sphereMesh.rotation.x = -0.15 * elapsedTime;
    planeMesh.rotation.x = -0.15 * elapsedTime;
    taurusMesh.rotation.x = -0.15 * elapsedTime;
	// update controls
	controls.update();
	// render
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
