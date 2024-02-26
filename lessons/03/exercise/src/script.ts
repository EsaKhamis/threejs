import * as three from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
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

// Material
const cube = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshBasicMaterial({ color: debugObject.color })
);

cube.position.z = -1.5;
cube.position.y = -1.5;

gui.addColor(debugObject, 'color').onChange(() => {
    cube.material.color.set(debugObject.color);
});
// scene.add(cube);

// const axesHelper = new three.AxesHelper();
// scene.add(axesHelper);

const textureLoader = new three.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/5.png');
matcapTexture.colorSpace = three.SRGBColorSpace;

// Fonts
const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(
        'Esa is the Best!',
        {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4,
        }
    );

    const textMaterial = new three.MeshMatcapMaterial({ matcap: matcapTexture });
    const text = new three.Mesh(textGeometry, textMaterial);

    textGeometry.center();

    gui.addColor(debugObject, 'color').onChange(() => {
        text.material.color.set(debugObject.color);
    });
    // textMaterial.wireframe = true;
    scene.add(text);

    const donutGeometry = new three.TorusGeometry(0.3, 0.2, 20, 45);

    for (let i=0; i<1000; i++) {
        const donut = new three.Mesh(donutGeometry, textMaterial);
        donut.position.x = (Math.random() - 0.5) * 25;
        donut.position.y = (Math.random() - 0.5) * 25;
        donut.position.z = (Math.random() - 0.5) * 25;
        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;
        const scale = Math.random();
        donut.scale.set(scale, scale, scale);
        scene.add(donut);
    }
});

const clock = new three.Clock();

// animation
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
