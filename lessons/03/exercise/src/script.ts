import * as three from 'three';
import './styles.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// cursor
const cursor = {
	x: 0,
	y: 0,
};

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

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
const geometry: three.BoxGeometry = new three.BoxGeometry(1, 1, 1, 5, 5, 5);
const material: three.MeshBasicMaterial = new three.MeshBasicMaterial({
	color: 0x0000ff,
});
const mesh: three.Mesh = new three.Mesh(geometry, material);

scene.add(mesh);

// camera
// fov should be 45-75
const camera: three.PerspectiveCamera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const aspectRatio = sizes.width / sizes.height;
// const camera: three.OrthographicCamera = new three.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
camera.position.z = 3;
// camera.position.y = 2;
// camera.position.x = 2;
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
