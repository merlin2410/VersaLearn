let sketch = function(p) {
    let mode = 'point-1d';
    let target = { x: 200, y: 200, angle: 0 };
    let isDragging = false;
    let isRotating = false;
    const infoTitle = document.getElementById('info-title');
    const infoText = document.getElementById('info-text');
    const rotateCheckbox = document.getElementById('rotate-mode-checkbox');
    const rotateControl = document.getElementById('rotate-control');

    p.setup = function() {
        let canvasContainer = document.getElementById('canvas-container');
        let canvas = p.createCanvas(500, 400); // FIX: Use a fixed size
        canvas.parent('canvas-container');
        p.rectMode(p.CENTER);
        target.x = p.width / 2;
        target.y = p.height / 2;

        const radios = document.querySelectorAll('input[name="dof-mode"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                mode = e.target.value;
                updateInfoBox();
                target.x = p.width / 2;
                target.y = p.height / 2;
                target.angle = 0;
                rotateControl.style.display = mode === 'body-2d' ? 'block' : 'none';
                rotateCheckbox.checked = false;
            });
        });
    };
    p.draw = function() {
        p.background(255);
        if (mode === 'point-1d') { p.stroke(200); p.strokeWeight(2); p.line(0, p.height / 2, p.width, p.height / 2); }
        if (isDragging && !isRotating) {
            if (mode === 'point-1d') { target.x = p.mouseX; target.y = p.height / 2; }
            else { target.x = p.mouseX; target.y = p.mouseY; }
        }
        if (isRotating) { target.angle = p.atan2(p.mouseY - target.y, p.mouseX - target.x); }
        target.x = p.constrain(target.x, 15, p.width - 15);
        target.y = p.constrain(target.y, 15, p.height - 15);
        p.push();
        p.translate(target.x, target.y); // FIX: Removed extra dot
        p.rotate(target.angle);
        p.stroke(0);
        p.strokeWeight(2);
        if (mode === 'body-2d') { p.fill(100, 100, 250); p.rect(0, 0, 80, 40); p.stroke(255, 0, 0); p.line(0, 0, 40, 0); }
        else { p.fill(250, 100, 100); p.circle(0, 0, 30); }
        p.pop();
    };
    p.mousePressed = function() {
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
        let d = p.dist(p.mouseX, p.mouseY, target.x, target.y);
        if (mode === 'body-2d' && rotateCheckbox.checked) {
            if (d < 50) isRotating = true;
        } else {
            if (d < 50) isDragging = true;
        }
    };
    p.mouseReleased = function() { isDragging = false; isRotating = false; };
    function updateInfoBox() {
        if (mode === 'point-1d') { infoTitle.textContent = 'Point on a Line'; infoText.innerHTML = 'Drag the point to move it. <strong>1 DOF</strong> (Translation in X).'; }
        else if (mode === 'point-2d') { infoTitle.textContent = 'Point in a Plane'; infoText.innerHTML = 'Drag the point to move it. <strong>2 DOF</strong> (Translation in X and Y).'; }
        else if (mode === 'body-2d') { infoTitle.textContent = 'Rigid Body in a Plane'; infoText.innerHTML = 'Drag to move. Check <strong>Rotate Mode</strong> and drag to rotate. <strong>3 DOF</strong>.'; }
    }
};
new p5(sketch);
