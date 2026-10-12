class FractalFlame {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.animation = null;
        this.w = canvas.width;
        this.h = canvas.height;
        this.velocity = 60;

        this.variation = 'sinusoidal';
        this.gamma = 1.5;
        this.scaleValue = 250;
        this.scale = { 'x': 1, 'y': 1 };
        this.zoomFactor = 1.1;

        this.x = 0.1;
        this.y = 0.1;
        this.colorList = ['#00ffff'];
        this.color = 0;
        this.pixelSize = 0.75;

        this.transforms = [
            { a: -0.71, b: 0.23, c: -0.45, d: -0.62, e: 0.1, f: -0.2, p: 0.25 },
            { a: 0.52, b: -0.11, c: 0.38, d: 0.49, e: -0.3, f: 0.4, p: 0.50 },
            { a: 0.65, b: 0.28, c: -0.12, d: 0.55, e: 0.2, f: -0.1, p: 0.75 },
            { a: -0.42, b: 0.61, c: 0.25, d: -0.32, e: -0.1, f: 0.3, p: 1.00 }
        ];
    }

    static init(canvas) {
        const ff = new FractalFlame(canvas);
        const params = document.getElementById('fractal-flame-params');
        const gammaInput = document.getElementById('set-gamma');
        const velocityInput = document.getElementById('velocity');
        const velocityValue = document.getElementById('velocity-value');

        canvas.style.width = '100%';
        canvas.style.height = '100%';

        if (params) {
            const loadPreset = (valueStr) => {
                if (!valueStr) return;
                try {
                    const preset = JSON.parse(valueStr);
                    ff.variation = preset.variation;
                    ff.scaleValue = preset.scale;
                } catch (e) {
                    console.error("Failed to parse FractalFlame preset", e);
                }
            };

            loadPreset(params.value);

            const handlePresetChange = () => {
                ff.stop();
                ff.clear();
                loadPreset(params.value);
            };
            params.addEventListener('input', handlePresetChange);
            params.addEventListener('change', handlePresetChange);
        }

        if (gammaInput) {
            const gammaValue = document.getElementById('gamma-value');
            gammaInput.addEventListener("input", () => {
                ff.gamma = Number(gammaInput.value) || 1.5;
                if (gammaValue) gammaValue.innerText = ff.gamma;
            });
        }

        if (velocityInput && velocityValue) {
            velocityInput.value = ff.velocity;
            velocityValue.innerText = ff.velocity;
            velocityInput.addEventListener("input", () => {
                velocityValue.innerText = velocityInput.value;
            });
            velocityInput.addEventListener("change", () => {
                ff.velocity = Number(velocityInput.value);
                if (ff.animation) {
                    ff.stop();
                    ff.start();
                }
            });
        }

        if (typeof window !== 'undefined') {
            if (window.startBtn) window.startBtn(ff);
            if (window.clearBtn) window.clearBtn(ff);
            if (window.stopBtn) window.stopBtn(ff);
            if (window.zoomOutBtn) window.zoomOutBtn(ff);
            if (window.zoomInBtn) window.zoomInBtn(ff);
            if (window.setColorBtn) window.setColorBtn(ff);
        }

        ff.bgBlack();
        return ff;
    }

    bgBlack() {
        this.ctx.fillStyle = '#05070c';
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    draw() {
        let r = Math.random();
        let t = this.transforms[0];

        for (let i = 0; i < this.transforms.length; i++) {
            if (r < this.transforms[i].p) {
                t = this.transforms[i];
                break;
            }
        }

        let linX = t.a * this.x + t.b * this.y + t.e;
        let linY = t.c * this.x + t.d * this.y + t.f;

        let r2 = linX * linX + linY * linY + 0.001;
        let nextX, nextY;

        switch (this.variation) {
            case 'spherical':
                nextX = linX / r2;
                nextY = linY / r2;
                break;
            case 'swirl':
                let sinR2 = Math.sin(r2);
                let cosR2 = Math.cos(r2);
                nextX = linX * sinR2 - linY * cosR2;
                nextY = linX * cosR2 + linY * sinR2;
                break;
            case 'hyperbolic':
                let theta = Math.atan2(linY, linX);
                let r = Math.sqrt(r2);
                nextX = Math.sin(theta) / r;
                nextY = Math.cos(theta) * r;
                break;
            case 'popcorn':
                nextX = linX + 0.05 * Math.sin(Math.tan(3 * linY));
                nextY = linY + 0.05 * Math.sin(Math.tan(3 * linX));
                break;
            case 'sinusoidal':
            default:
                nextX = Math.sin(linX);
                nextY = Math.sin(linY);
                break;
        }

        let plotX = this.w / 2 + nextX * this.scaleValue;
        let plotY = this.h / 2 + nextY * this.scaleValue;

        if (plotX >= 0 && plotX < this.w && plotY >= 0 && plotY < this.h) {
            this.ctx.globalAlpha = this.gamma !== 1.5 ? Math.min(1, 0.1 * this.gamma) : 1;
            this.ctx.beginPath();
            this.ctx.fillStyle = this.colorList[this.color];
            this.ctx.arc(plotX, plotY, this.pixelSize, 0, 2 * Math.PI, true);
            this.ctx.fill();
        }

        this.x = nextX;
        this.y = nextY;
    }

    start() {
        if (this.animation) return;
        this.animation = setInterval(() => {
            for (let i = 0; i < 40; i++) {
                this.draw();
            }
        }, 1000 / this.velocity);
    }

    stop() {
        clearInterval(this.animation);
        this.animation = null;
    }

    clear() {
        this.stop();
        this.x = 0.1;
        this.y = 0.1;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.scale = { 'x': 1, 'y': 1 };
        this.ctx.globalAlpha = 1.0;
        this.bgBlack();
    }

    zoomIn() {
        this.stop();
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.bgBlack();
        this.scale.x *= this.zoomFactor;
        this.scale.y *= this.zoomFactor;
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.scale(this.zoomFactor, this.zoomFactor);
        this.ctx.translate(-this.w / 2, -this.h / 2);
        this.start();
    }

    zoomOut() {
        this.stop();
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.bgBlack();
        this.scale.x /= this.zoomFactor;
        this.scale.y /= this.zoomFactor;
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.scale(1 / this.zoomFactor, 1 / this.zoomFactor);
        this.ctx.translate(-this.w / 2, -this.h / 2);
        this.start();
    }

    setColor(list, color) {
        this.colorList = list;
        this.color = Number(color) % this.colorList.length;
        this.ctx.fillStyle = this.colorList[this.color];
        return this.colorList[this.color];
    }
}

if (typeof window !== 'undefined') window.FractalFlame = FractalFlame;

export function init(canvas) { return FractalFlame.init(canvas); }
export default FractalFlame;
