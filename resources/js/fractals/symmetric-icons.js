class SymmetricIcon {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');

        canvas.width = canvas.clientWidth || window.innerWidth;
        canvas.height = canvas.clientHeight || window.innerHeight;
        this.w = canvas.width;
        this.h = canvas.height;

        this.velocity = 20;
        this.colorList = ['#156472', '#00ffff'];
        this.color = 1;

        this.animation = null;

        this.x = 0.01;
        this.y = 0.01;

        this.degree = 6; // Ступінь симетрії (n)
        this.lambda = -2.7; // a0
        this.alpha = 5.0; // a1
        this.beta = 1.5; // a2
        this.gamma = 1.0; // a3
        this.omega = 0.0; // a4
        this.scale = Math.min(this.w, this.h) * 0.3;

    }
    static init(canvas) {
        const velocityInput = document.getElementById('velocity');
        const velocity = document.getElementById('velocity-value');
        const params = document.getElementById('symetric-icons-params');

        const icon = new SymmetricIcon(canvas);

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.backgroundColor = '#0c0c0c';

        if (params) {
            params.addEventListener('input', () => {
                const preset = JSON.parse(params.value);
                icon.stop();
                icon.clear();
                icon.alpha = preset.alpha;
                icon.beta = preset.beta;
                icon.gamma = preset.gamma;
                icon.omega = preset.omega;
                icon.degree = preset.degree;
                icon.scale = Math.min(icon.w, icon.h) * preset.scale;
                icon.lambda = preset.lambda;
                icon.x = preset.startX;
                icon.y = preset.startY;
            });
        }

        if (velocityInput && velocity) {
            velocityInput.value = icon.velocity;
            velocity.innerText = icon.velocity;
            velocityInput.addEventListener("input", () => {
                velocity.innerText = velocityInput.value;
            });
            velocityInput.addEventListener("change", () => {
                icon.velocity = velocityInput.value;
                if (icon.animation) {
                    icon.stop();
                    icon.start();
                }
            });
        }

        if (typeof window !== 'undefined') {
            if (window.startBtn) window.startBtn(icon);
            if (window.clearBtn) window.clearBtn(icon);
            if (window.stopBtn) window.stopBtn(icon);
            if (window.setColorBtn) window.setColorBtn(icon);
        }

    }

    start() {
        if (this.animation) return;

        this.ctx.fillStyle = this.colorList[this.color];

        this.animation = setInterval(() => {
            for (let i = 0; i < 1000; i++) {
                this.drawStep();
            }
        }, 1000 / this.velocity);
    }

    drawStep() {
        // zzbar = |z|^2 = x^2 + y^2
        const zzbar = this.x * this.x + this.y * this.y;

        //infinity protection
        if (zzbar > 1e6) {
            this.x = 0.01;
            this.y = 0.01;
            return;
        }

        //p = alpha * |z|^2 + lambda
        let p = this.alpha * zzbar + this.lambda;

        // z^(n-1)
        let zreal = this.x;
        let zimag = this.y;
        for (let i = 1; i < this.degree - 1; i++) {
            const za = zreal * this.x - zimag * this.y;
            const zb = zimag * this.x + zreal * this.y;
            zreal = za;
            zimag = zb;
        }

        // Re(z^n) = Re(z * z^(n-1)) = x * zreal - y * zimag
        const zn = this.x * zreal - this.y * zimag;
        p += this.beta * zn;

        const nextX = p * this.x + this.gamma * zreal - this.omega * this.y;
        const nextY = p * this.y - this.gamma * zimag + this.omega * this.x;

        const screenX = this.w / 2 + nextX * this.scale;
        const screenY = this.h / 2 + nextY * this.scale;

        // гострі пікселі з прозорістю для ефекту накопичення світла
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillRect(screenX, screenY, 1, 1);

        this.x = nextX;
        this.y = nextY;
    }
    stop() {
        clearInterval(this.animation);
        this.animation = null;
    }
    clear() {
        this.stop();
        this.x = 0.01;
        this.y = 0.01;
        this.ctx.globalAlpha = 1.0;
        this.ctx.clearRect(0, 0, this.w, this.h);
    }
    setColor(list, color) {
        this.colorList = list;
        this.color = color;
        this.ctx.fillStyle = this.colorList[this.color];
        return this.colorList[this.color];
    }
}


if (typeof window !== 'undefined') window.SymmetricIcon = SymmetricIcon;

export function init(canvas) { return SymmetricIcon.init(canvas); }
export default SymmetricIcon;

