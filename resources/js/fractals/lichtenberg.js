class Lichtenberg {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.animation = null;
        this.w = canvas.width;
        this.h = canvas.height;

        this.velocity = 15;
        this.colorList = ['#00ffff'];
        this.color = 0;

        this.growthPoints = [];

        this.totalMainBranches = 17;
        this.initLength = 42;
        this.initWidth = 5.8;

        this.lengthDecayMin = 0.88;
        this.lengthDecayMax = 0.96;
        this.widthDecay = 0.83;
        this.wiggleFactor = 0.55;

        this.maxDepth = 35;
        this.minLength = 1.5;
        this.minWidth = 0.08;
    }
    static init(canvas) {

        const velocityInput = document.getElementById('velocity');
        const velocity = document.getElementById('velocity-value');


        canvas.width = canvas.clientWidth || window.innerWidth;
        canvas.height = canvas.clientHeight || window.innerHeight;

        const lichtenberg = new Lichtenberg(canvas);

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.backgroundColor = '#0c0c0c';

        if (velocityInput && velocity) {
            velocityInput.value = lichtenberg.velocity;
            velocity.innerText = lichtenberg.velocity;
            velocityInput.addEventListener("input", () => {
                lichtenberg.velocity = velocityInput.value;
                velocity.innerText = velocityInput.value;
                if (lichtenberg.animation) {
                    lichtenberg.stop();
                    lichtenberg.start();
                }
            });
        }


        if (typeof window !== 'undefined') {
            if (window.startBtn) window.startBtn(lichtenberg);
            if (window.clearBtn) window.clearBtn(lichtenberg);
            if (window.stopBtn) window.stopBtn(lichtenberg);
            if (window.setColorBtn) window.setColorBtn(lichtenberg);
        }

    }
    start() {
        if (this.animation) return;

        if (this.growthPoints.length === 0) {
            const startX = this.w / 2;
            const startY = this.h / 2;

            for (let i = 0; i < this.totalMainBranches; i++) {
                this.growthPoints.push({
                    x: startX,
                    y: startY,
                    angle: (i * Math.PI * 2) / this.totalMainBranches,
                    len: this.initLength,
                    width: this.initWidth,
                    depth: 0
                });
            }

            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
        }

        this.animation = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                this.grow();
            }
        }, 1000 / this.velocity);
    }
    grow() {
        if (this.growthPoints.length === 0) {
            this.stop();
            return;
        }
        const pt = this.growthPoints.shift();

        if (pt.len < this.minLength || pt.width < this.minWidth || pt.depth > this.maxDepth) {
            return;
        }
        const nextX = pt.x + pt.len * Math.cos(pt.angle);
        const nextY = pt.y + pt.len * Math.sin(pt.angle);

        if (nextX < 0 || nextX > this.w || nextY < 0 || nextY > this.h) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(pt.x, pt.y);
        this.ctx.lineTo(nextX, nextY);
        this.ctx.lineWidth = pt.width;
        this.ctx.strokeStyle = this.colorList[this.color];

        this.ctx.shadowBlur = pt.depth < 4 ? 14 : 4;
        this.ctx.shadowColor = this.colorList[this.color];
        this.ctx.stroke();

        // Calculating next steps
        const nextLen = pt.len * (this.lengthDecayMin + Math.random() * (this.lengthDecayMax - this.lengthDecayMin));
        const nextWidth = pt.width * this.widthDecay;
        const wiggle = (Math.random() - 0.5) * this.wiggleFactor;

        this.growthPoints.push({
            x: nextX,
            y: nextY,
            angle: pt.angle + wiggle,
            len: nextLen,
            width: nextWidth,
            depth: pt.depth + 1
        });

        const branchChance = pt.depth < 6 ? 0.4 : 0.22;
        if (Math.random() < branchChance) {
            const sideAngle = pt.angle + (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.45);

            this.growthPoints.push({
                x: nextX,
                y: nextY,
                angle: sideAngle,
                len: nextLen * 0.85,
                width: nextWidth * 0.8,
                depth: pt.depth + 1
            });
        }
    }
    stop() {
        clearInterval(this.animation);
        this.animation = null;
    }
    clear() {
        this.stop();
        this.growthPoints = [];
        this.ctx.clearRect(0, 0, this.w, this.h);
    }
    setColor(list, color) {
        this.colorList = list;
        this.color = color;
        this.ctx.fillStyle = this.colorList[this.color];
        return this.colorList[this.color];
    }
}

if (typeof window !== 'undefined') window.Lichtenberg = Lichtenberg;

export function init(canvas) { return Lichtenberg.init(canvas); }
export default Lichtenberg;
