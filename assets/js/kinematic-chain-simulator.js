let sketch = function(p) {
    let chainType = 'open';
    let theta1 = -90, theta2 = 30, theta3 = 30;
    const l1 = 80, l2 = 60, l3 = 50;
    const base = { x: 150, y: 320 };

    const a = 120, b = 150, c = 100, d = 180;
    const p1 = { x: 210, y: 250 };
    const p4 = { x: p1.x + d, y: p1.y };

    const sliders = { t1: document.getElementById('theta1'), t2: document.getElementById('theta2'), t3: document.getElementById('theta3') };
    const values = { t1: document.getElementById('theta1-value'), t2: document.getElementById('theta2-value'), t3: document.getElementById('theta3-value') };
    const infoTitle = document.getElementById('info-title');
    const infoText = document.getElementById('info-text');

    p.setup = function() {
        let canvas = p.createCanvas(600, 400);
        canvas.parent('canvas-container-kinematic-chain');
        p.angleMode(p.DEGREES);
        document.querySelectorAll('input[name="chain-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => { chainType = e.target.value; updateControls(); });
        });
        Object.values(sliders).forEach(slider => {
            slider.addEventListener('input', updateAnglesFromSliders);
        });
        updateControls();
    };

    p.draw = function() {
        p.background(255);
        drawGrid();
        if (chainType === 'open') { drawOpenChain(); } else { drawClosedChain(); }
    };

    function drawOpenChain() {
        drawBase();
        p.push();
        p.translate(base.x, base.y);
        p.rotate(theta1); drawLink(l1, '#3b82f6');
        p.translate(l1, 0);
        p.rotate(theta2); drawLink(l2, '#16a34a');
        p.translate(l2, 0);
        p.rotate(theta3); drawLink(l3, '#ef4444', true);
        p.pop();
    }

    function drawBase() {
        p.fill(108, 117, 125);
        p.noStroke();
        p.rect(base.x - 40, base.y, 80, 20, 5);
    }

    function drawClosedChain() {
        const p2 = { x: p1.x + a * p.cos(theta1), y: p1.y + a * p.sin(theta1) };
        const diag = p.dist(p2.x, p2.y, p4.x, p4.y);
        if (diag > b + c || diag < Math.abs(b - c)) {
            drawBar(p1, p2, '#ef4444');
            drawBar(p4, {x:p4.x - c, y:p4.y}, '#3b82f6');
            return;
        }
        const angle1 = p.acos((b * b + diag * diag - c * c) / (2 * b * diag));
        const angle2 = p.atan2(p4.y - p2.y, p4.x - p2.x);
        const theta3_calc = angle2 - angle1;
        const p3 = { x: p2.x + b * p.cos(theta3_calc), y: p2.y + b * p.sin(theta3_calc) };
        drawBar(p1, p4, '#64748b'); drawBar(p1, p2, '#16a34a');
        drawBar(p2, p3, '#f97316'); drawBar(p4, p3, '#3b82f6');
        p.push();
        p.translate(p2.x, p2.y);
        p.rotate(p.atan2(p3.y - p2.y, p3.x - p2.x));
        p.fill(249, 115, 22, 150); p.stroke('#f97316'); p.strokeWeight(2);
        p.beginShape();
        p.vertex(10, -20); p.vertex(b - 10, -20); p.vertex(b - 30, 20);
        p.vertex(b / 2, 40); p.vertex(30, 20);
        p.endShape(p.CLOSE);
        p.pop();
    }

    function drawLink(len, col, isEndEffector = false) {
        p.stroke(col); p.strokeWeight(10); p.line(0, 0, len, 0);
        p.noStroke(); p.fill(col); p.circle(0, 0, 20);
        if (isEndEffector) {
            p.push(); p.translate(len, 0);
            p.fill(200); p.stroke(150); p.strokeWeight(2);
            p.rectMode(p.CENTER); p.rect(0, 0, 20, 20);
            p.rect(20, -10, 20, 5); p.rect(20, 10, 20, 5);
            p.pop();
        } else { p.circle(len, 0, 20); }
    }

    function drawBar(pt1, pt2, col) {
        p.stroke(col); p.strokeWeight(10); p.line(pt1.x, pt1.y, pt2.x, pt2.y);
        p.noStroke(); p.fill(col); p.circle(pt1.x, pt1.y, 20); p.circle(pt2.x, pt2.y, 20);
    }

    function drawGrid() {
        p.stroke(230); p.strokeWeight(1);
        for (let x = 0; x <= p.width; x += 20) p.line(x, 0, x, p.height);
        for (let y = 0; y <= p.height; y += 20) p.line(0, y, p.width, y);
    }

    function updateControls() {
        if (chainType === 'open') {
            sliders.t1.disabled = false; sliders.t2.disabled = false; sliders.t3.disabled = false;
            infoTitle.textContent = 'Open Kinematic Chain';
            infoText.textContent = 'A 3R manipulator. All three joints can be controlled independently.';
        } else {
            sliders.t1.disabled = false; sliders.t2.disabled = true; sliders.t3.disabled = true;
            infoTitle.textContent = 'Closed Kinematic Chain';
            infoText.textContent = 'A four-bar linkage. Only the first joint can be controlled.';
        }
        updateAnglesFromSliders();
    }

    function updateAnglesFromSliders() {
        theta1 = parseFloat(sliders.t1.value);
        theta2 = parseFloat(sliders.t2.value);
        theta3 = parseFloat(sliders.t3.value);
        values.t1.textContent = `${theta1.toFixed(0)}°`;
        values.t2.textContent = `${theta2.toFixed(0)}°`;
        values.t3.textContent = `${theta3.toFixed(0)}°`;
    }
};
new p5(sketch);
