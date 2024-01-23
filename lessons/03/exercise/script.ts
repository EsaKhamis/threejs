import * as three from 'three';

// canvas
const canvas: HTMLCanvasElement = document.querySelector('.webgl');

// scene
const scene: three.scene = new three.Scene();

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
