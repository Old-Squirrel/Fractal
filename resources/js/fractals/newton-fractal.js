class Newton {

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.zoom = 2;
        this.scale = 250;
        this.orderZ = 2;
        this.pixelSize = 0.55;
        this.center = { 'x': 0, 'y': 0 };
        this.animation = null;
        this.counter = 0;
    }

    generateData() {
        const direction = [1, -1];
        const order = this.scale.toString().length + 2;
        const range = [];
        const data = [];
        const step = 1 / (this.scale * 2);
        const getRange = direct => {
            const value = 0;
            let coord = value * direct;
            for (let i = 0; i <= this.w; i++) {
                range.push({ 'x': +coord.toFixed(order) });
                coord += step * direct;
            }
        }
        direction.forEach(coord => getRange(coord));
        range.forEach(coord => {
            coord.y = range[this.counter].x;
            data.push(coord);
            data.push({ 'x': coord.x, 'y': -1 * coord.y });
        })
        this.counter += 1;
        switch (true) {
            case this.counter <= this.h: return data;
            case this.counter > this.h:
                this.animation = null;
                return [{ 'x': undefined, 'y': undefined }];
        }
    }

    toComplex(order) {
        return this.generateData().map(coord => {
            coord.x += this.center.x;
            coord.y += this.center.y;
            let c = new Complex(coord.x, coord.y);
            c.re = +c.re.toFixed(order);
            c.im = +c.im.toFixed(order);
            return c;
        })
    }

    isBelongsToSet(order) {
        const outSet = [];

        // z^3 - 1 = 0
        const roots = [
            { re: 1, im: 0 },
            { re: -0.5, im: 0.866025 },
            { re: -0.5, im: -0.866025 }
        ];

        this.toComplex(order).forEach(c => {
            let z = c;
            let pixel = {};

            for (let i = 1; i <= 60; i++) {
                // z^2
                let z2_re = z.re * z.re - z.im * z.im;
                let z2_im = 2 * z.re * z.im;

                //z^3
                let z3_re = z2_re * z.re - z2_im * z.im;
                let z3_im = z2_re * z.im + z2_im * z.re;

                // z_next = z - (z^3 - 1) / (3 * z^2)
                let num_re = z3_re - 1;
                let num_im = z3_im;

                let den_re = 3 * z2_re;
                let den_im = 3 * z2_im;

                let denom = den_re * den_re + den_im * den_im;
                if (denom === 0) break;

                let next_re = z.re - (num_re * den_re + num_im * den_im) / denom;
                let next_im = z.im - (num_im * den_re - num_re * den_im) / denom;

                z = { re: next_re, im: next_im };
                let foundRoot = -1;
                for (let r = 0; r < roots.length; r++) {
                    let dist_re = z.re - roots[r].re;
                    let dist_im = z.im - roots[r].im;
                    if (dist_re * dist_re + dist_im * dist_im < 0.000001) {
                        foundRoot = r;
                        break;
                    }
                }

                if (foundRoot !== -1) {
                    let x = (c.re - this.center.x) * this.scale + this.w / 2;
                    let y = (c.im - this.center.y) * this.scale + this.w / 2;

                    let color = 'black';
                    if (foundRoot === 0) color = `rgb(${i * 4}, 0, 0)`;
                    if (foundRoot === 1) color = `rgb(0, ${i * 4}, 0)`;
                    if (foundRoot === 2) color = `rgb(0, 0, ${i * 4})`;

                    outSet.push({ 'x': x, 'y': y, 'color': color });
                    break;
                }
            }
        });
        return outSet;
    }

    fillPage(setScale, setCoordX, setCoordY) {
        setScale.value = this.scale;
        setCoordX.value = this.center.x;
        setCoordY.value = this.center.y;
        return this;
    }

    bgBlack() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        return this;
    }

    draw() {
        const order = this.scale.toString().length + 2;
        this.isBelongsToSet(order).forEach(c => {
            this.ctx.fillStyle = c.color;
            this.ctx.fillRect(c.x, c.y, this.pixelSize, this.pixelSize);
        });
    }

    start() {
        this.animation = setInterval(() => this.draw(), 250);
    }

    stop() {
        clearInterval(this.animation);
        this.animation = false;
    }

    clear() {
        this.stop();
        this.animation = false;
        this.counter = 0;
        this.bgBlack();
    }

    static init(canvas) {
        const startBtn = document.getElementById('start-btn');
        const orderSelect = document.getElementById('mode-select');
        const setCoordX = document.getElementById('set-coord-x');
        const setCoordY = document.getElementById('set-coord-y');
        const setScale = document.getElementById('set-scale');

        const newton = new Newton(canvas);

        newton.fillPage(setScale, setCoordX, setCoordY);
        canvas.style.backgroundColor = '#0c0c0c';

        canvas.addEventListener("mousedown", e => {
            const scrollWidth = 6;
            if (!newton.animation && e.button === 0) {
                const order = newton.scale.toString().length + 2;
                newton.w = canvas.scrollWidth - scrollWidth;
                newton.h = canvas.scrollHeight - scrollWidth;
                const updatedCenter = {
                    x: (e.offsetX - newton.w / 2) / newton.scale,
                    y: (e.offsetY - newton.h / 2) / newton.scale
                };
                newton.center.x += updatedCenter.x;
                newton.center.y += updatedCenter.y;
                newton.scale *= newton.zoom;
                newton.center.x = +newton.center.x.toFixed(order);
                newton.center.y = +newton.center.y.toFixed(order);
                newton.counter = 0;
                newton.fillPage(setScale, setCoordX, setCoordY);
                newton.start();
            }

        });

        if (startBtn) {
            startBtn.addEventListener("click", () => {
                const scrollWidth = 6;
                if (!newton.animation) {
                    newton.w = canvas.scrollWidth - scrollWidth;
                    newton.h = canvas.scrollHeight - scrollWidth;
                    newton.fillPage(setScale, setCoordX, setCoordY);
                    newton.start();
                }
            });
        }
        if (orderSelect) {
            orderSelect.addEventListener("change", () => {
                newton.clear();
                newton.center.x = 0;
                newton.center.y = 0;
                newton.scale = 250;
                newton.orderZ = orderSelect.value
            });
        }

        if (setCoordY && setCoordX && setScale) {
            setCoordY.addEventListener("change", () => {
                newton.scale = setScale.value;
                newton.center.x = +setCoordX.value;
                newton.center.y = +setCoordY.value;
            });
        }

        if (typeof window !== 'undefined') {
            if (window.clearBtn) window.clearBtn(newton);
            if (window.stopBtn) window.stopBtn(newton);
        }

    }
}

if (typeof window !== 'undefined') window.Newton = Newton;

export function init(canvas) { return Newton.init(canvas); }
export default Newton;


