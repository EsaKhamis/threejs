import * as three from 'three';

// canvas
const canvas: any = document.querySelector('.webgl');

// scene
const scene: three.Scene = new three.Scene();

// group
const group: three.Group = new three.Group();

const axesHelper = new three.AxesHelper(2);
scene.add(axesHelper);
scene.add(group);

const cube1: three.Mesh = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshBasicMaterial({ color: 0xff0000 })
);

const cube2: three.Mesh = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshBasicMaterial({ color: 0x00ff00 })
);

const cube3: three.Mesh = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshBasicMaterial({ color: 0x0000ff })
);

group.add(cube1);
group.add(cube2);
group.add(cube3);

cube2.position.x = -2;
cube3.position.x = 2;

group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;

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
