import * as three from 'three';
import './styles.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import gsap from 'gsap';

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
// canvas
const canvas: any = document.querySelector('.webgl');

// scene
const scene: three.Scene = new three.Scene();

// object
const geometry: three.BoxGeometry = new three.BoxGeometry(1, 1, 1, debugObject.subdivions, debugObject.subdivions, debugObject.subdivions);
// const geometry: three.BufferGeometry = new three.BufferGeometry();
// const count = 50;
// const positionsArray = new Float32Array(count * 3 * 3);
// for (let i = 0; i < count * 3 * 3; i++) {
//     positionsArray[i] = (Math.random() - 0.5) * 4;
// }
// const positionsAttribute = new three.BufferAttribute(positionsArray, 3);
// geometry.setAttribute('position', positionsAttribute);

const material: three.MeshBasicMaterial = new three.MeshBasicMaterial({
	color: debugObject.color,
    wireframe: true,
});
const mesh: three.Mesh = new three.Mesh(geometry, material);

scene.add(mesh);

const cubeTweaks = gui.addFolder('Cube Tweaks');
// cubeTweaks.close();
cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.1).name('elevation');
cubeTweaks.add(mesh.position, 'x').min(-3).max(3).step(0.1).name('horizontal');
cubeTweaks.add(mesh, 'visible');
cubeTweaks.add(material, 'wireframe');
cubeTweaks.addColor(debugObject, 'color').onChange((colour) => {
    material.color.set(debugObject.color);
});

debugObject.spin = () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
}

cubeTweaks.add(debugObject, 'spin');

cubeTweaks.add(debugObject, 'subdivions').min(1).max(20).step(1).onFinishChange(() => {
    console.log('subvision changed')
    const newGeometry = new three.BoxGeometry(1, 1, 1, debugObject.subdivions, debugObject.subdivions, debugObject.subdivions);
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
});


// camera
// fov should be 45-75
const camera: three.PerspectiveCamera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// const aspectRatio = sizes.width / sizes.height;
// const camera: three.OrthographicCamera = new three.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
camera.position.z = 3;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(mesh.position);
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
	// Clock
	//   const elapsedTime = clock.getElapsedTime();

	//   mesh.rotation.y = elapsedTime;

	// update camera
	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
	// camera.position.y = Math.cos(cursor.y * Math.PI * 2) * 3;
	// camera.position.z = Math.sin(cursor.y * Math.PI * 2) * 3;
	// camera.lookAt(mesh.position);

	// update controls
	controls.update();
	// render
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
