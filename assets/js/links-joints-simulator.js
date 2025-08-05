let sketch = function(p) {
    let jointType = 'revolute';
    let jointValue = 0;
    const linkLength = 200;
    const linkWidth = 20;
    const baseOrigin = { x: 200, y: 250 };

    const slider = document.getElementById('joint-slider');
    const sliderLabel = document.getElementById('slider-label');
    const sliderValue = document.getElementById('slider-value');
    const infoTitle = document.getElementById('info-title');
    const infoText = document.getElementById('info-text');

    p.setup = function() {
        let canvas = p.createCanvas(600, 400);
        canvas.parent('canvas-container-links');
        p.angleMode(p.DEGREES);

        const radios = document.querySelectorAll('input[name="joint-type"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                jointType = e.target.value;
                updateControls();
            });
        });

        slider.addEventListener('input', (e) => {
            jointValue = parseFloat(e.target.value);
            updateSliderValue();
        });

        updateControls();
    };

    p.draw = function() {
        p.background(255);
        drawGrid();

        if (jointType === 'revolute') {
            // Draw Link i-1
            p.push();
            p.translate(baseOrigin.x, baseOrigin.y);
            p.fill(60, 80, 120, 150);
            p.stroke(60, 80, 120);
            p.strokeWeight(2);
            p.rectMode(p.CORNER);
            p.rect(0, -linkWidth / 2, linkLength, linkWidth, 5);
            p.fill(255); p.stroke(0); p.strokeWeight(1);
            p.text('Link i-1', linkLength / 2 - 30, 5);
            p.pop();

            // Draw Joint Axis
            p.push();
            p.translate(baseOrigin.x, baseOrigin.y);
            p.stroke(50, 50, 50, 100); p.strokeWeight(1);
            p.drawingContext.setLineDash([5, 5]);
            p.noFill(); p.circle(0, 0, 60);
            p.drawingContext.setLineDash([]);
            p.fill(50); p.noStroke();
            p.text('Axis i', 15, -40);
            p.pop();

            // Draw Link i
            p.push();
            p.translate(baseOrigin.x, baseOrigin.y);
            p.rotate(jointValue);
            p.fill(220, 70, 70, 150);
            p.stroke(220, 70, 70);
            p.rect(0, -linkWidth / 2, linkLength, linkWidth, 5);
            p.fill(255); p.stroke(0); p.strokeWeight(1);
            p.text('Link i', linkLength / 2 - 20, 5);
            p.pop();

        } else if (jointType === 'prismatic') {
            // Draw Link i-1 (guide)
            p.push();
            p.translate(baseOrigin.x, baseOrigin.y);
            p.fill(60, 80, 120, 150);
            p.stroke(60, 80, 120);
            p.strokeWeight(2);
            p.rect(0, -linkWidth, linkLength, 5, 3);
            p.rect(0, linkWidth-5, linkLength, 5, 3);
            p.fill(255); p.stroke(0); p.strokeWeight(1);
            p.text('Link i-1', linkLength / 2 - 30, -30);
            p.pop();

            // Draw Link i (slider)
            p.push();
            p.translate(baseOrigin.x + jointValue, baseOrigin.y);
            p.fill(220, 70, 70, 200);
            p.stroke(220, 70, 70);
            p.rectMode(p.CENTER);
            p.rect(0, 0, 80, 35, 5);
            p.fill(255); p.stroke(0); p.strokeWeight(1);
            p.text('Link i', -15, 5);
            p.pop();
        }
    };

    function drawGrid() {
        p.stroke(230); p.strokeWeight(1);
        for (let x = 0; x < p.width; x += 20) p.line(x, 0, x, p.height);
        for (let y = 0; y < p.height; y += 20) p.line(0, y, p.width, y);
    }

    function updateControls() {
        if (jointType === 'revolute') {
            slider.min = -180; slider.max = 180; slider.value = 0; jointValue = 0;
            sliderLabel.textContent = 'Angle (θ)';
            infoTitle.textContent = 'Revolute Joint';
            infoText.textContent = 'Allows rotational motion about a single axis.';
        } else {
            slider.min = 0; slider.max = linkLength - 80; slider.value = 0; jointValue = 0;
            sliderLabel.textContent = 'Distance (d)';
            infoTitle.textContent = 'Prismatic Joint';
            infoText.textContent = 'Allows linear motion along a single axis.';
        }
        updateSliderValue();
    }

    function updateSliderValue() {
        if (jointType === 'revolute') {
            sliderValue.textContent = `${jointValue.toFixed(0)}°`;
        } else {
            sliderValue.textContent = `${jointValue.toFixed(0)} units`;
        }
    }
};
new p5(sketch);
