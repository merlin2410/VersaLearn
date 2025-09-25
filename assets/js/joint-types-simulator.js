const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const container = document.getElementById('canvas-container-joints');

if (container) {
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(150, 200, 300);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xcccccc, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const linkMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.6 });
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.3, roughness: 0.7 });
    const jointMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.4 });

    const worldAxes = new THREE.AxesHelper(250);
    scene.add(worldAxes);

    let baseLink = new THREE.Group();
    let movingLink = new THREE.Group();
    scene.add(baseLink);
    scene.add(movingLink);

    function clearModels() {
        while(baseLink.children.length > 0) baseLink.remove(baseLink.children[0]);
        while(movingLink.children.length > 0) movingLink.remove(movingLink.children[0]);
    }

    function createRevoluteJoint() {
        const base = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), baseMaterial);
        const hinge = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 60, 32), jointMaterial);
        hinge.rotation.x = Math.PI / 2;
        base.add(hinge);
        baseLink.add(base);

        const link = new THREE.Mesh(new THREE.BoxGeometry(150, 20, 30), linkMaterial);
        link.position.x = 75;
        movingLink.add(link);
    }

    function createPrismaticJoint() {
        const base = new THREE.Mesh(new THREE.BoxGeometry(40, 120, 40), baseMaterial);
        baseLink.add(base);

        const slider = new THREE.Mesh(new THREE.BoxGeometry(30, 80, 30), linkMaterial);
        movingLink.add(slider);
    }

    function createCylindricalJoint() {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(40, 40, 200, 32), baseMaterial);
        baseLink.add(base);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 250, 32), linkMaterial);
        const pointer = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5), jointMaterial);
        pointer.position.x = 25;
        shaft.add(pointer);
        movingLink.add(shaft);
    }

    function createSphericalJoint() {
        const baseSocket = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), baseMaterial);
        baseSocket.rotation.x = -Math.PI / 2;
        baseLink.add(baseSocket);

        const ball = new THREE.Mesh(new THREE.SphereGeometry(25, 32, 16), jointMaterial);
        const link = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 150, 32), linkMaterial);
        link.position.y = 75;
        const pointer = new THREE.Mesh(new THREE.BoxGeometry(40, 6, 6), new THREE.MeshStandardMaterial({color: 0xff0000}));
        pointer.position.set(20, 75, 0);
        link.add(pointer);
        ball.add(link);
        movingLink.add(ball);
    }

    function createScrewJoint() {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 40, 32), baseMaterial);
        baseLink.add(base);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 250, 32), linkMaterial);
        const pointer = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5), jointMaterial);
        pointer.position.x = 25;
        shaft.add(pointer);
        movingLink.add(shaft);
    }

    function createPlanarJoint() {
        const base = new THREE.Mesh(new THREE.BoxGeometry(200, 10, 200), baseMaterial);
        base.position.y = -5;
        baseLink.add(base);

        const plate = new THREE.Mesh(new THREE.BoxGeometry(80, 10, 60), linkMaterial);
        plate.position.y = 10;
        const pointer = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5), jointMaterial);
        pointer.position.x = 25;
        plate.add(pointer);
        movingLink.add(plate);
    }

    let currentMode = 'R';
    const sliders = { tx: document.getElementById('tx'), ty: document.getElementById('ty'), tz: document.getElementById('tz'), rx: document.getElementById('rx'), ry: document.getElementById('ry'), rz: document.getElementById('rz') };
    const sliderContainers = { tx: document.getElementById('slider-tx'), ty: document.getElementById('slider-ty'), tz: document.getElementById('slider-tz'), rx: document.getElementById('slider-rx'), ry: document.getElementById('slider-ry'), rz: document.getElementById('slider-rz') };
    const readouts = { tx: document.getElementById('tx-val'), ty: document.getElementById('ty-val'), tz: document.getElementById('tz-val'), rx: document.getElementById('rx-val'), ry: document.getElementById('ry-val'), rz: document.getElementById('rz-val') };
    const info = { title: document.getElementById('info-title'), text: document.getElementById('info-text') };

    const jointInfo = {
        'R': { name: 'Revolute', dof: 1, constraints: 5, active: ['ry'], model: createRevoluteJoint },
        'P': { name: 'Prismatic', dof: 1, constraints: 5, active: ['ty'], model: createPrismaticJoint },
        'C': { name: 'Cylindrical', dof: 2, constraints: 4, active: ['ty', 'ry'], model: createCylindricalJoint },
        'S': { name: 'Spherical', dof: 3, constraints: 3, active: ['rx', 'ry', 'rz'], model: createSphericalJoint },
        'H': { name: 'Screw', dof: 1, constraints: 5, active: ['ry'], model: createScrewJoint },
        'E': { name: 'Planar', dof: 3, constraints: 3, active: ['tx', 'tz', 'ry'], model: createPlanarJoint }
    };

    function updateControls() {
        const config = jointInfo[currentMode];
        info.title.textContent = `${config.name} Joint`;
        info.text.textContent = `Allows motion described by the active sliders. DOF: ${config.dof}, Constraints: ${config.constraints}.`;

        for (const key in sliders) {
            const isActive = config.active.includes(key);
            sliders[key].disabled = !isActive;
            sliderContainers[key].style.display = isActive ? 'block' : 'none';
        }
        Object.values(sliders).forEach(s => s.value = 0);

        clearModels();
        config.model();
    }

    document.querySelectorAll('input[name="joint-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentMode = e.target.value;
            updateControls();
        });
    });

    function animate() {
        requestAnimationFrame(animate);

        const tx = parseFloat(sliders.tx.value);
        const ty = parseFloat(sliders.ty.value);
        const tz = parseFloat(sliders.tz.value);
        const rx = THREE.MathUtils.degToRad(parseFloat(sliders.rx.value));
        const ry = THREE.MathUtils.degToRad(parseFloat(sliders.ry.value));
        const rz = THREE.MathUtils.degToRad(parseFloat(sliders.rz.value));

        movingLink.position.set(0,0,0);
        movingLink.rotation.set(0,0,0);

        if (currentMode === 'H') {
            const pitch = 0.5;
            movingLink.position.y = parseFloat(sliders.ry.value) * pitch;
            movingLink.rotation.y = ry;
        } else {
            movingLink.position.set(tx, ty, tz);
            movingLink.rotation.set(rx, ry, rz);
        }

        Object.keys(readouts).forEach(key => {
            if (!sliders[key].disabled) {
                const readout = readouts[key];
                const slider = sliders[key];
                if (key.startsWith('r')) {
                    readout.textContent = `${slider.value}°`;
                } else {
                    readout.textContent = slider.value;
                }
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    updateControls();
    animate();
}
