import * as three from 'three';
import gsap from 'gsap';

// canvas
const canvas: any = document.querySelector('.webgl');

// scene
const scene: three.Scene = new three.Scene();

// object
const geometry: three.BoxGeometry = new three.BoxGeometry(1, 1, 1);
const material: three.MeshBasicMaterial = new three.MeshBasicMaterial({ color: 0x0000ff });
const mesh: three.Mesh = new three.Mesh(geometry, material);

scene.add(mesh);

const sizes = {
    width: 800,
    height: 600
}

// camera
const camera: three.PerspectiveCamera = new three.PerspectiveCamera(75, sizes.width/sizes.height);
camera.position.z = 3;

scene.add(camera);

// renderer
const renderer: three.WebGLRenderer = new three.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);

// const clock = new three.Clock();

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

// animation
const tick = () => {
    // Clock
    // const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime);

    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);

    // camera.lookAt(mesh.position);

    // render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();
