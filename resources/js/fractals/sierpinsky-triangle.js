class SierpinskyTriangle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animation = null;
        this.w = canvas.width;
        this.h = canvas.height;
        this.velocity = 60;
        this.n = 3;
        this.d = 0.5;
        this.scale = { 'x': 1, 'y': 1 };
        this.colorList = ['green'];
        this.color = 0;
        this.pixelSize = 2;

        this.startPoints = [
            { x: 441, y: 88 },
            { x: 260, y: 540 },
            { x: 732, y: 409 },
            { x: 471, y: 850 },
            { x: 220, y: 260 },
            { x: 760, y: 192 },
            { x: 361, y: 709 },
            { x: 804, y: 329 }
        ];

        this.defaultPoint = { x: 590, y: 369 };
        this.x = this.defaultPoint.x;
        this.y = this.defaultPoint.y;
        this.letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

        this.draggedPoint = null;
        this.isDragging = false;
        this.hitRadius = 15;
    }

    static init(canvas) {
        const st = new SierpinskyTriangle(canvas);

        const counterInput = document.getElementById('counter');
        const counterValue = document.getElementById('counter-value');
        const dividerInput = document.getElementById('divider');
        const dividerValue = document.getElementById('divider-value');
        const velocityInput = document.getElementById('velocity');
        const velocityValue = document.getElementById('velocity-value');
        const colorInput = document.getElementById('color-input');
        const colorValue = document.getElementById('color-value');

        canvas.style.width = '100%';
        canvas.style.height = '100%';

        if (typeof window !== 'undefined') {
            if (window.startBtn) window.startBtn(st);
            if (window.clearBtn) window.clearBtn(st);
            if (window.stopBtn) window.stopBtn(st);
            if (window.setColorBtn) window.setColorBtn(st);
        }

        if (counterInput && counterValue) {
            counterInput.addEventListener("input", () => {
                st.n = Number(counterInput.value);
                counterValue.innerText = counterInput.value;
                st.drawStartPoints();
            });
        }

        if (dividerInput && dividerValue) {
            dividerInput.addEventListener("input", () => {
                st.d = Number(dividerInput.value);
                dividerValue.innerText = dividerInput.value;
            });
        }

        if (velocityInput && velocityValue) {
            velocityInput.addEventListener("input", () => {
                st.velocity = Number(velocityInput.value);
                velocityValue.innerText = velocityInput.value;
            });
        }

        if (colorInput && colorValue) {
            colorInput.addEventListener("input", () => {
                st.color = Number(colorInput.value) % st.colorList.length;
                colorValue.innerText = colorInput.value;
            });
        }

        st.initDragEvents();
        st.drawStartPoints();
        return st;
    }

    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.w / rect.width;
        const scaleY = this.h / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    findPointAt(coords) {
        const distDefault = Math.hypot(coords.x - this.defaultPoint.x, coords.y - this.defaultPoint.y);
        if (distDefault <= this.hitRadius) {
            return this.defaultPoint;
        }

        for (let i = 0; i < this.n; i++) {
            const pt = this.startPoints[i];
            const dist = Math.hypot(coords.x - pt.x, coords.y - pt.y);
            if (dist <= this.hitRadius) {
                return pt;
            }
        }

        return null;
    }

    initDragEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const coords = this.getCanvasCoords(e);
            const targetPoint = this.findPointAt(coords);

            if (targetPoint) {
                this.draggedPoint = targetPoint;
                this.isDragging = true;
                this.canvas.style.cursor = 'grabbing';
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const coords = this.getCanvasCoords(e);

            if (this.isDragging && this.draggedPoint) {
                this.canvas.style.cursor = 'grabbing';
                this.draggedPoint.x = Math.round(coords.x);
                this.draggedPoint.y = Math.round(coords.y);

                if (this.draggedPoint === this.defaultPoint) {
                    this.x = this.defaultPoint.x;
                    this.y = this.defaultPoint.y;
                }

                if (!this.animation) {
                    this.drawStartPoints();
                }
            } else {
                const hoveredPoint = this.findPointAt(coords);
                this.canvas.style.cursor = hoveredPoint ? 'grab' : 'default';
            }
        });

        const stopDrag = () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.draggedPoint = null;
                this.canvas.style.cursor = 'default';
            }
        };

        this.canvas.addEventListener('mouseup', stopDrag);
        this.canvas.addEventListener('mouseleave', stopDrag);
    }

    drawFilledCircle(centerX, centerY, radius, color, textColor = '', text = '') {
        this.ctx.beginPath();
        if (text) {
            this.ctx.fillStyle = textColor;
            this.ctx.font = 'italic 15pt Calibri';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(text, centerX - 10, centerY);
        }
        this.ctx.fillStyle = color;
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }

    drawStartPoints() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.w, this.h);

        for (let i = 0; i < this.n; i++) {
            this.drawFilledCircle(this.startPoints[i].x, this.startPoints[i].y, 4, 'blue', 'black', this.letters[i]);
        }
        this.drawFilledCircle(this.defaultPoint.x, this.defaultPoint.y, 6, 'red', 'black', 'StartPoint');
    }

    draw() {
        const randomElement = Math.floor(Math.random() * this.n);

        this.x = (this.x + this.startPoints[randomElement].x) * this.d;
        this.y = (this.y + this.startPoints[randomElement].y) * this.d;

        this.drawFilledCircle(this.x, this.y, this.pixelSize, this.colorList[this.color]);
    }

    start() {
        if (this.animation) return;
        this.animation = setInterval(() => {
            for (let i = 0; i < 20; i++) {
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
        this.x = this.defaultPoint.x;
        this.y = this.defaultPoint.y;
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.drawStartPoints();
    }

    setColor(list, color) {
        this.colorList = list;
        this.color = color;
        this.ctx.fillStyle = this.colorList[this.color];
        return this.colorList[this.color];
    }
}

if (typeof window !== 'undefined') window.SierpinskyTriangle = SierpinskyTriangle;

export function init(canvas) { return SierpinskyTriangle.init(canvas); }
export default SierpinskyTriangle;
