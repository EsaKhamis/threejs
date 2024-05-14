import * as three from 'three';
// import './styles.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
/**
 * Debug
 */
const gui = new GUI({
    width: 300,
    title: 'Esa\'s Debug UI',
    closeFolders: false,
});
gui.hide();

/**
 * Textures
 */
const textureLoader = new three.TextureLoader();
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
bakedShadow.colorSpace = three.SRGBColorSpace;

const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');
simpleShadow.colorSpace = three.SRGBColorSpace;
// console.log(simpleShadow);
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
    color: '#ffffff',
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
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

const scene = new three.Scene();

const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

const renderer = new three.WebGLRenderer({
    canvas: canvas,
});
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = false;
renderer.shadowMap.type = three.PCFSoftShadowMap;

/**
 * Lights
 */
const ambientLight = new three.AmbientLight(0xffffff, .5);
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('Ambient Light Intensity');
gui.addColor(ambientLight, 'color').name('Ambient Light Color').onChange(() => {
    ambientLight.color.set(ambientLight.color);
});
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight(0xffffff, 0.2);
directionalLight.position.set(2,2,2);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.near = 1;

directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

directionalLight.shadow.radius = 10;

gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('Directional Light Intensity');
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
gui.addColor(directionalLight, 'color').name('Directional Light Color').onChange(() => {
    directionalLight.color.set(directionalLight.color);
});

scene.add(directionalLight);

const directionalLightCameraHelper = new three.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// spotlight
const spotlight = new three.SpotLight(0xffffff, 2, 10, Math.PI * 0.3);
spotlight.position.set(0, 2, 2);
spotlight.castShadow = true;
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;
spotlight.shadow.camera.fov = 30;
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 6;

scene.add(spotlight);
scene.add(spotlight.target);

const spotlightCameraHelper = new three.CameraHelper(spotlight.shadow.camera);
spotlightCameraHelper.visible = false;
scene.add(spotlightCameraHelper);

// pointlight
const pointlight = new three.PointLight(0xffffff, 2.7);
pointlight.position.set(-1, 1, 0);
pointlight.castShadow = true;
pointlight.shadow.mapSize.width = 1024;
pointlight.shadow.mapSize.height = 1024;
pointlight.shadow.camera.near = 1;
pointlight.shadow.camera.far = 6;

scene.add(pointlight);

const pointlightCameraHelper = new three.CameraHelper(pointlight.shadow.camera);
pointlightCameraHelper.visible = false;
scene.add(pointlightCameraHelper);

/**
 * Objects
 */
// Material
const material = new three.MeshStandardMaterial({ color: debugObject.color });
material.roughness = 0.7;
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

// Objects
const sphere = new three.Mesh(
    new three.SphereGeometry(0.5, 32, 32),
    material
);
sphere.castShadow = true;

const plane = new three.Mesh(
    new three.PlaneGeometry(5, 5),
    material
    // })
);
plane.receiveShadow = true;
plane.rotation.x = - Math.PI * 0.5;
plane.position.y = - 0.65;

const sphereShadow = new three.Mesh(
    new three.PlaneGeometry(1.5, 1.5),
    new three.MeshBasicMaterial({
        color: 0x000000,
        alphaMap: simpleShadow,
        // map: bakedShadow,
        transparent: true,
    })
);

sphereShadow.rotation.x = - Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphere, plane, sphereShadow);

/**
 * Animate
 */
const clock = new three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = (Math.abs(Math.sin(elapsedTime * 3)) * 1.5) - 0.25;
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
