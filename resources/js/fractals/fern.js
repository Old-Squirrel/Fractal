class Fern {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.animation = null;
        this.w = canvas.width;
        this.h = canvas.height;
        this.velocity = 75;
        this.x = 0;
        this.y = 0;
        this.scale = { 'x': 1, 'y': 1 };
        this.colorList = ['green'];
        this.color = 0;
        this.pixelSize = 0.65;

    }
    static init(canvas) {
        const fern = new Fern(canvas);
        const velocityInput = document.getElementById('velocity');
        const velocity = document.getElementById('velocity-value');

        canvas.style.width = '100%';
        canvas.style.height = '100%';

        if (typeof window !== 'undefined') {
            if (window.startBtn) window.startBtn(fern);
            if (window.clearBtn) window.clearBtn(fern);
            if (window.stopBtn) window.stopBtn(fern);
            if (window.stopBtn) window.zoomOutBtn(fern);
            if (window.stopBtn) window.zoomInBtn(fern);
            if (window.setColorBtn) window.setColorBtn(fern);
        }

        if (velocityInput && velocity) {
            velocityInput.addEventListener("input", () => fern.velocity = velocity.innerText = velocityInput.value);
        }
    }
    drawFilledCircle(centerX, centerY, radius, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
    draw() {
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

    }
    start() {
        this.animation = setInterval(() => {
            for (let i = 0; i < 20; i++)
                this.draw();
        }, 1000 / this.velocity);
    }
    stop() {
        clearInterval(this.animation);
        this.animation = null;
    }
    clear() {
        this.stop();
        this.ctx.clearRect(0, 0, this.w, this.h);
    }
    zoomIn() {
        this.clear();
        this.scale.x *= 1.1;
        this.scale.y *= 1.1;
        this.ctx.scale(this.scale.x, this.scale.y);
        this.start();
    }
    zoomOut() {
        this.clear();
        this.scale.x = this.scale.x / 1.1;
        this.scale.y = this.scale.y / 1.1;
        this.ctx.scale(this.scale.x, this.scale.y);
        this.start();
    }
    setColor(list, color) {
        this.colorList = list;
        this.color = color;
        this.ctx.fillStyle = this.colorList[this.color];
        return this.colorList[this.color];
    }
};

// Attach to window for legacy scripts
if (typeof window !== 'undefined') window.Fern = Fern;

// Named init export and default export for ES modules
export function init(canvas) { return Fern.init(canvas); }
export default Fern;
