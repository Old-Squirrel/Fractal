class Diagram {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');

        // Встановлюємо чітку роздільну здатність canvas
        canvas.width = canvas.clientWidth || window.innerWidth;
        canvas.height = canvas.clientHeight || window.innerHeight;

        this.w = canvas.width;
        this.h = canvas.height;

        // Відступи для осей
        this.offsetX = this.w * 0.08;
        this.offsetY = this.h * 0.08;

        // Робоча область для малювання графіка
        this.graphW = this.w - this.offsetX * 2;
        this.graphH = this.h - this.offsetY * 2;

        this.initValue = 0.5; // Початкове X0
        this.velocity = 60; // Швидкість кадрів інтервалу
        this.animation = null;

        //Фокусуємося на зоні хаосу R від 2.4 до 4.0
        this.minR = 2.4;
        this.maxR = 4.0;
        this.r = this.minR; // Стартуємо відразу з цікавого місця
        this.step = 0.002; // Крок збільшення R за один кадр

        this.colorList = ['#00ffff'];
        this.color = 0;
    }
    static init(canvas) {
        const velocityInput = document.getElementById('velocity');
        const velocity = document.getElementById('velocity-value');

        const diagram = new Diagram(canvas);

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.backgroundColor = '#0c0c0c';

        if (velocity && velocityInput) {
            velocityInput.value = diagram.velocity;
            velocity.innerText = diagram.velocity;
            velocityInput.addEventListener("input", () => {
                diagram.velocity = velocityInput.value;
                velocity.innerText = velocityInput.value;
                if (diagram.animation) {
                    diagram.stop();
                    diagram.start();
                }
            });
        }

        if (typeof window !== 'undefined') {
            if (window.startBtn) window.startBtn(diagram);
            if (window.clearBtn) window.clearBtn(diagram);
            if (window.stopBtn) window.stopBtn(diagram);
            if (window.setColorBtn) window.setColorBtn(diagram);
        }

        diagram.axis();
    }
    // Малювання красивої координатної сітки
    axis() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#3a3a50';
        this.ctx.lineWidth = 2;

        // Вісь Y
        this.ctx.moveTo(this.offsetX, this.offsetY);
        this.ctx.lineTo(this.offsetX, this.h - this.offsetY);
        // Вісь X
        this.ctx.lineTo(this.w - this.offsetX, this.h - this.offsetY);
        this.ctx.stroke();

        // Підписи осей
        this.ctx.font = "14px Arial";
        this.ctx.fillStyle = '#8a8a1a';
        this.ctx.fillText('Популяція (Xn)', this.offsetX - 60, this.offsetY - 15);
        this.ctx.fillText('Коефіцієнт росту (R)', this.w - this.offsetX, this.h - this.offsetY + 25);

        // Мітки по осі X (Значення R)
        this.ctx.fillStyle = '#555577';
        for (let rVal = this.minR; rVal <= this.maxR; rVal += 0.2) {
            const x = this.offsetX + ((rVal - this.minR) / (this.maxR - this.minR)) * this.graphW;
            this.ctx.fillText(rVal.toFixed(1), x - 10, this.h - this.offsetY + 20);
            this.ctx.fillRect(x, this.h - this.offsetY, 1, 5); // засічка
        }

        // Мітки по осі Y (Значення Xn від 0 до 1)
        for (let yVal = 0; yVal <= 1; yVal += 0.25) {
            const y = this.h - this.offsetY - yVal * this.graphH;
            this.ctx.fillText(yVal.toFixed(2), this.offsetX - 45, y + 5);
            this.ctx.fillRect(this.offsetX - 5, y, 5, 1); // засічка
        }
    }
    // Метод малювання одного вертикального зрізу для поточного значення R
    drawStep() {
        if (this.r > this.maxR) {
            this.stop();
            return;
        }

        // Перераховуємо поточну координату X на Canvas для значення R
        const screenX = this.offsetX + ((this.r - this.minR) / (this.maxR - this.minR)) * this.graphW;

        // Рахуємо логістичне рівняння
        let xn = this.initValue;

        // Проганяємо перші 200 ітерацій «вхолосту», щоб система стабілізувалася (прийшла до атрактора)
        for (let i = 0; i < 200; i++) {
            xn = this.r * xn * (1 - xn);
        }

        // Налаштування стилю точок під твій неон
        this.ctx.fillStyle = this.colorList[this.color];

        // Наступні 300 ітерацій — це реальні точки стабільного стану або хаосу, їх ми й малюємо
        for (let i = 0; i < 300; i++) {
            xn = this.r * xn * (1 - xn);

            // Масштабуємо отримане значення xn по вертикалі
            const screenY = this.h - this.offsetY - xn * this.graphH;

            // Малюємо крапку розміром в 1 піксель.
            // Використовуємо мінімальну прозорість, щоб зони накопичення точок виглядали об'ємно
            this.ctx.globalAlpha = 0.15;
            this.ctx.fillRect(screenX, screenY, 1, 1);
        }

        // Крокуємо до наступного значення R
        this.r += this.step;
    }
    start() {
        if (this.animation) return;

        this.animation = setInterval(() => {
            // Прораховуємо по 2 вертикальні стовпці за кадр для оптимальної швидкості
            for (let i = 0; i < 2; i++) {
                this.drawStep();
            }
        }, 1000 / this.velocity);
    }
    stop() {
        clearInterval(this.animation);
        this.animation = null;
    }
    clear() {
        this.stop();
        this.r = this.minR; // Повертаємося до початкового R = 2.4
        this.ctx.globalAlpha = 1.0;
        this.axis();
    }
    setColor(list, color) {
        this.colorList = list;
        this.color = color;
        this.ctx.fillStyle = this.colorList[this.color];
        return this.colorList[this.color];
    }
}









// Attach to window for legacy scripts
if (typeof window !== 'undefined') window.Diagram = Diagram;

// Named init export and default export for ES modules
export function init(canvas) { return Diagram.init(canvas); }
export default Diagram;
