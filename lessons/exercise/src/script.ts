import * as three from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import './styles.css';
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
 * Lights
 */
const ambientLight = new three.AmbientLight(0xffffff, 1.5);
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('Ambient Light Intensity');
gui.addColor(ambientLight, 'color').name('Ambient Light Color').onChange(() => {
    ambientLight.color.set(ambientLight.color);
});
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(1,0.25,0);
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('Directional Light Intensity');
gui.addColor(directionalLight, 'color').name('Directional Light Color').onChange(() => {
    directionalLight.color.set(directionalLight.color);
});
scene.add(directionalLight);

const hemisphereLight = new three.HemisphereLight(0xff0000, 0x0000ff, .9);
gui.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001).name('Hemisphere Light Intensity');

scene.add(hemisphereLight);

const pointLight = new three.PointLight(0xff9000, 1.5, 4);
pointLight.position.x = 1;
pointLight.position.y = -0.5;
pointLight.position.z = 1;
scene.add(pointLight);

const rectAreaLight = new three.RectAreaLight(0x4e00ff, 6, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new three.Vector3());
scene.add(rectAreaLight);

// spotlight
const spotLight = new three.SpotLight(0x78ff00, 4.5,10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

scene.add(spotLight.target);

spotLight.target.position.x = -1.75;

/**
 * Helpers
 */

const hemisphereLightHelper = new three.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new three.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new three.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new three.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// const axesHelper = new three.AxesHelper();
// scene.add(axesHelper);

const textureLoader = new three.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
matcapTexture.colorSpace = three.SRGBColorSpace;


/**
 * Objects
 */
// Material
const material = new three.MeshStandardMaterial({ color: debugObject.color });
material.roughness = 0.4;
// material.color = debugObject.color;

// Objects
const sphere = new three.Mesh(
    new three.SphereGeometry(0.5, 32, 32),
    material
);
sphere.position.x = - 1.5;

// Material
const cube = new three.Mesh(
    new three.BoxGeometry(.75, .75, .75),
    material, //new three.MeshBasicMaterial({ color: debugObject.color })
);

const torus = new three.Mesh(
    new three.TorusGeometry(0.3, 0.2, 32, 64),
    material
);
torus.position.x = 1.5;

const plane = new three.Mesh(
    new three.PlaneGeometry(5, 5),
    material
);
plane.rotation.x = - Math.PI * 0.5;
plane.position.y = - 0.65;

gui.addColor(debugObject, 'color').onChange(() => {
    cube.material.color.set(debugObject.color);
});


scene.add(sphere, cube, torus, plane);

/**
 * Animate
 */
const clock = new three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime
        cube.rotation.y = 0.1 * elapsedTime
        torus.rotation.y = 0.1 * elapsedTime
    
        sphere.rotation.x = 0.15 * elapsedTime
        cube.rotation.x = 0.15 * elapsedTime
        torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
