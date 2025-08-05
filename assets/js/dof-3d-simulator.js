import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('canvas-container-3d');
if (container) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(100, 150, 250);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(80, 30, 50);
    const materials = [
        new THREE.MeshLambertMaterial({ color: 0xff6b6b }), // right (+X)
        new THREE.MeshLambertMaterial({ color: 0x843838 }), // left (-X)
        new THREE.MeshLambertMaterial({ color: 0x4dff4d }), // top (+Y)
        new THREE.MeshLambertMaterial({ color: 0x267d26 }), // bottom (-Y)
        new THREE.MeshLambertMaterial({ color: 0x4da6ff }), // front (+Z)
        new THREE.MeshLambertMaterial({ color: 0x26537d })  // back (-Z)
    ];
    const rigidBody = new THREE.Mesh(geometry, materials);
    scene.add(rigidBody);

    const worldAxes = new THREE.AxesHelper(200);
    scene.add(worldAxes);
    const bodyAxes = new THREE.AxesHelper(60);
    rigidBody.add(bodyAxes);

    const sliders = {
        posX: document.getElementById('posX'), posY: document.getElementById('posY'), posZ: document.getElementById('posZ'),
        rotX: document.getElementById('rotX'), rotY: document.getElementById('rotY'), rotZ: document.getElementById('rotZ')
    };
    const readouts = {
        posX: document.getElementById('posX-val'), posY: document.getElementById('posY-val'), posZ: document.getElementById('posZ-val'),
        rotX: document.getElementById('rotX-val'), rotY: document.getElementById('rotY-val'), rotZ: document.getElementById('rotZ-val')
    };

    function animate() {
        requestAnimationFrame(animate);
        const posX = parseFloat(sliders.posX.value);
        const posY = parseFloat(sliders.posY.value);
        const posZ = parseFloat(sliders.posZ.value);
        const rotX = THREE.MathUtils.degToRad(parseFloat(sliders.rotX.value));
        const rotY = THREE.MathUtils.degToRad(parseFloat(sliders.rotY.value));
        const rotZ = THREE.MathUtils.degToRad(parseFloat(sliders.rotZ.value));
        rigidBody.position.set(posX, posY, posZ);
        rigidBody.rotation.set(rotX, rotY, rotZ);
        readouts.posX.textContent = posX.toFixed(0);
        readouts.posY.textContent = posY.toFixed(0);
        readouts.posZ.textContent = posZ.toFixed(0);
        readouts.rotX.textContent = (rotX * 180 / Math.PI).toFixed(0);
        readouts.rotY.textContent = (rotY * 180 / Math.PI).toFixed(0);
        readouts.rotZ.textContent = (rotZ * 180 / Math.PI).toFixed(0);
        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
}
