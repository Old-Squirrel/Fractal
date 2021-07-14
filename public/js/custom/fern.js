function Fern(canvas) {
    this.ctx = canvas.getContext('2d');
    this.animation = null;
    this.w = canvas.width;
    this.h = canvas.height;
    this.velocity = 75;
    this.x = 0;
    this.y = 0;
    this.scale = { 'x': 1, 'y': 1 };
    this.colorList = ['blue', 'gray' ,'red', 'green', 'yellow'];
    this.color = 3;
    this.pixelSize = 0.65;

};
Fern.prototype.drawFilledCircle = function (centerX, centerY, radius, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    this.ctx.fill();
};
Fern.prototype.draw = function () {

    let nextX, nextY;
    let r = Math.random();
    if (r < 0.01) {
        nextX = 0;
        nextY = 0.16 * this.y;
    } else if (r < 0.86) {
        nextX = 0.85 * this.x + 0.04 * this.y;
        nextY = -0.04 * this.x + 0.85 * this.y + 1.6;
    } else if (r < 0.93) {
        nextX = 0.20 * this.x - 0.26 * this.y;
        nextY = 0.23 * this.x + 0.22 * this.y + 1.6;
    } else {
        nextX = -0.15 * this.x + 0.28 * this.y;
        nextY = 0.26 * this.x + 0.24 * this.y + 0.44;
    }

    // positioning
    let plotX = this.w * (this.x + 3) / 6;
    let plotY = this.h - this.h * ((this.y + 1) / 12);

    this.drawFilledCircle(plotX, plotY, this.pixelSize, this.colorList[this.color]);

    this.x = nextX;
    this.y = nextY;

};


Fern.prototype.start = function () {
    this.animation = setInterval(() => {
        for (let i = 0; i < 20; i++)
            this.draw();

    }, 1000 / this.velocity);
};
Fern.prototype.stop = function () {
    clearInterval(this.animation);
    this.animation = null;
}
Fern.prototype.clear = function () {
    this.stop();
    this.ctx.clearRect(0, 0, this.w, this.h);
};

Fern.prototype.zoomIn = function () {
    this.clear();
    this.scale.x *= 1.1;
    this.scale.y *= 1.1;
    this.ctx.scale(this.scale.x, this.scale.y);
    this.start();

};

Fern.prototype.zoomOut = function () {
    this.clear();
    this.scale.x = this.scale.x / 1.1;
    this.scale.y = this.scale.y / 1.1;
    this.ctx.scale(this.scale.x, this.scale.y);
    this.start();
};

Fern.init = () => {
    const canvas = document.getElementById("layer");
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
    const velocityInput = document.getElementById('velocity');
    const velocity = document.getElementById('velocity-value');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const colorInput = document.getElementById('color-input');
    const colorValue = document.getElementById('color-value');
    const fern = new Fern(canvas);

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    colorValue.style.color = 'green';

    velocityInput.addEventListener("input", () =>
        fern.velocity = velocity.innerText = velocityInput.value);

    colorInput.addEventListener("input", () => {
        fern.color = colorInput.value;
        colorValue.style.color = fern.colorList[fern.color];
    });

    zoomInBtn.addEventListener("click", () => fern.zoomIn());
    zoomOutBtn.addEventListener("click", () => fern.zoomOut());
    startBtn.addEventListener("click", () => fern.start());
    clearBtn.addEventListener("click", () => fern.clear());
    stopBtn.addEventListener("click", () => fern.stop());

    return fern;

};

Fern.init();