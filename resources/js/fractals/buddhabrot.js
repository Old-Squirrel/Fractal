class Bset {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.zoom = 1.5;
        this.scale = 200;
        this.maxIterations = 200;
        this.samplesPerFrame = 30000;
        this.center = { 'x': -0.3, 'y': 0 };
        this.animation = null;
        this.imgData = {};

        this.density = new Int32Array(this.w * this.h);
        this.maxDensity = 0;
    }
    static init(canvas) {
        const startBtn = document.getElementById('start-btn');
        const setCoordX = document.getElementById('set-coord-x');
        const setCoordY = document.getElementById('set-coord-y');
        const setScale = document.getElementById('set-scale');

        const bset = new Bset(canvas);
        bset.bgBlack().fillPage(setScale, setCoordX, setCoordY);

        canvas.addEventListener("mousedown", e => {
            if (!bset.animation && e.button === 0) {
                bset.w = canvas.scrollWidth - 6;
                bset.h = canvas.scrollHeight - 6;

                const updatedCenter = {
                    x: (e.offsetY - bset.h / 2) / bset.scale,
                    y: -(e.offsetX - bset.w / 2) / bset.scale
                };
                bset.center.x += updatedCenter.x;
                bset.center.y += updatedCenter.y;
                bset.scale *= bset.zoom;

                bset.bgBlack();
                bset.fillPage(setScale, setCoordX, setCoordY);
                bset.start();
            }
        });

        startBtn.addEventListener("click", () => {
            if (!bset.animation) {
                bset.w = canvas.scrollWidth - 6;
                bset.h = canvas.scrollHeight - 6;
                bset.fillPage(setScale, setCoordX, setCoordY);
                bset.start();
            }
        });
        stopBtn(bset);
        clearBtn(bset);
    }
    bgBlack() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.density.fill(0);
        this.maxDensity = 0;
        return this;
    }
    generateChaosData() {
        const trajX = new Float64Array(this.maxIterations);
        const trajY = new Float64Array(this.maxIterations);

        for (let i = 0; i < this.samplesPerFrame; i++) {
            const cx = (Math.random() - 0.5) * (this.w / this.scale) + this.center.x;
            const cy = (Math.random() - 0.5) * (this.h / this.scale) + this.center.y;

            let zx = 0, zy = 0;
            let isEscaped = false;
            let iterCount = 0;

            for (let j = 0; j < this.maxIterations; j++) {
                const xtemp = zx * zx - zy * zy + cx;
                zy = 2 * zx * zy + cy;
                zx = xtemp;

                trajX[j] = zx;
                trajY[j] = zy;

                if (zx * zx + zy * zy > 4.0) {
                    isEscaped = true;
                    iterCount = j;
                    break;
                }
            }
            if (isEscaped) {
                for (let j = 0; j < iterCount; j++) {
                    const px = Math.floor(-(trajY[j] - this.center.y) * this.scale + this.w / 2);
                    const py = Math.floor((trajX[j] - this.center.x) * this.scale + this.h / 2);

                    if (px >= 0 && px < this.w && py >= 0 && py < this.h) {
                        const idx = py * this.w + px;
                        this.density[idx]++;
                        if (this.density[idx] > this.maxDensity) {
                            this.maxDensity = this.density[idx];
                        }
                    }
                }
            }
        }
    }
    draw() {
        this.generateChaosData();

        const canvasImgData = this.ctx.createImageData(this.w, this.h);
        const data = canvasImgData.data;

        for (let i = 0; i < this.density.length; i++) {
            const intensity = this.maxDensity > 0 ? (this.density[i] / this.maxDensity) : 0;

            const r = Math.min(255, Math.floor(Math.pow(intensity, 0.4) * 255));
            const g = Math.min(255, Math.floor(Math.pow(intensity, 0.7) * 120));
            const b = Math.min(255, Math.floor(Math.pow(intensity, 0.2) * 255));

            const pIdx = i * 4;
            data[pIdx] = r;
            data[pIdx + 1] = g;
            data[pIdx + 2] = b;
            data[pIdx + 3] = 255;
        }

        this.ctx.putImageData(canvasImgData, 0, 0);
    }
    start() {
        const id = this.center.x + ':' + this.center.y + ':' + this.scale;
        if (this.imgData[id]) {
            this.ctx.putImageData(this.imgData[id], 0, 0);
        } else {
            this.animation = setInterval(() => this.draw(), 80);
        }
    }
    stop() {
        clearInterval(this.animation);
        this.animation = null;
    }
    clear() {
        this.stop();
        this.bgBlack();
        this.imgData = {};
    }
    imageDataSave() {
        const id = this.center.x + ':' + this.center.y + ':' + this.scale;
        this.imgData[id] = this.ctx.getImageData(0, 0, this.w, this.h);
    }
    fillPage(setScale, setCoordX, setCoordY) {
        setScale.value = this.scale;
        setCoordX.value = this.center.x;
        setCoordY.value = this.center.y;
        return this;
    }
};

if (typeof window !== 'undefined') window.Bset = Bset;
export function init(canvas) { return Bset.init(canvas); }
export default Bset;
