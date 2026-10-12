class Tree {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.w = canvas.width;
        this.h = canvas.height;
        this.animation = null;
        this.angle = -Math.PI / 4;
        this.num = 2;

        this.fps = 30;
        this.lastTime = 0;
        this.isWind = false;
    }
    static init(canvas) {
        const branches = document.getElementById('branches');
        const windToggle = document.getElementById('wind-toggle');
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const tree = new Tree(canvas);

        if (zoomInBtn) zoomInBtn.style.display = 'none';
        if (zoomOutBtn) zoomOutBtn.style.display = 'none';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        tree.bgLight();

        if (branches) {
            branches.addEventListener("change", () => {
                tree.num = parseInt(branches.value, 10) || 2;
                tree.clear();
            });
        }

        if (windToggle) {
            windToggle.addEventListener("change", () => {
                tree.isWind = windToggle.checked;
            });
        }

        if (typeof window !== 'undefined') {
            if (window.startBtn) window.startBtn(tree);
            if (window.clearBtn) window.clearBtn(tree);
            if (window.stopBtn) window.stopBtn(tree);
        }
    }
    drawItSelf(startX, startY, startDirect, startRange, startI, maxI) {
        let queue = [{ x: startX, y: startY, direct: startDirect, range: startRange, i: startI }];

        while (queue.length > 0) {
            const current = queue.shift();

            const newX = current.x + Math.cos(current.direct) * current.range;
            const newY = current.y + Math.sin(current.direct) * current.range;

            const colorOffset = Math.floor(5 * newX / (newY || 1));
            const color = `rgb(${Math.abs(colorOffset * (10 - current.i))}, ${Math.abs(colorOffset * (current.i - 1))}, ${Math.abs(colorOffset * (current.i - 3))})`;

            this.ctx.lineWidth = 2 * current.i / 5;
            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(current.x, current.y);
            this.ctx.lineTo(newX, newY);
            this.ctx.stroke();

            if (current.i > 0 && this.num > 0) {
                const reductionScale = this.num === 2 ? 2 : this.num * (1 - (this.num * 0.09));
                const nextRange = current.range / Math.max(1.4, reductionScale);

                if (this.num === 1) {
                    let nextAngle = current.direct;
                    if (this.isWind) {
                        nextAngle += Math.sin(this.angle) * 0.02 * (maxI - current.i);
                    }
                    queue.push({ x: newX, y: newY, direct: nextAngle, range: nextRange, i: current.i - 1 });
                } else {
                    const startAngle = current.direct - this.angle;
                    const angleStep = (2 * this.angle) / (this.num - 1);

                    for (let b = 0; b < this.num; b++) {
                        let nextAngle = startAngle + (b * angleStep);

                        if (this.isWind) {
                            const windForce = Math.sin(this.angle * 1.5) * 0.03 * (maxI - current.i);
                            nextAngle += windForce;
                        }

                        queue.push({ x: newX, y: newY, direct: nextAngle, range: nextRange, i: current.i - 1 });
                    }
                }
            }
        }
    }
    bgLight() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.w, this.h);
    }
    draw(timestamp = 0) {
        this.animation = window.requestAnimationFrame((time) => this.draw(time));

        const interval = 1000 / this.fps;
        const delta = timestamp - this.lastTime;

        if (delta < interval) return;

        this.lastTime = timestamp - (delta % interval);

        this.ctx.clearRect(0, 0, this.w, this.h);
        this.bgLight();

        let dynamicDepth = Math.max(4, 11 - this.num);
        if (this.num === 2) dynamicDepth = 9;

        this.drawItSelf(this.w / 2, this.h / 2 + this.h / 3, -Math.PI / 2, this.h / 2.5, dynamicDepth, dynamicDepth);

        this.angle += 0.075;
        if (this.angle >= Math.PI * 2) this.angle = 0;
    }
    start() {
        if (!this.animation) {
            this.lastTime = performance.now();
            this.draw(this.lastTime);
        }
    }
    stop() {
        window.cancelAnimationFrame(this.animation);
        this.animation = null;
    }
    clear() {
        this.stop();
        this.angle = -Math.PI / 4;
        this.bgLight();
    }
}

if (typeof window !== 'undefined') window.Tree = Tree;

export function init(canvas) { return Tree.init(canvas); }
export default Tree;
