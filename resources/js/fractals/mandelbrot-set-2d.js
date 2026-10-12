class Mset {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.zoom = 2;
        this.scale = 250;
        this.orderZ = 2;
        this.pixelSize = 0.44;
        this.center = { 'x': 0, 'y': 0 };
        this.animation = null;
        this.counter = 0;
        this.imgData = {};
        //-0.777807810193171
        //0.131645108003206
    }
    static init(canvas) {
        const startBtn = document.getElementById('start-btn');
        const orderSelect = document.getElementById('mode-select');
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const setCoordX = document.getElementById('set-coord-x');
        const setCoordY = document.getElementById('set-coord-y');
        const setScale = document.getElementById('set-scale');
        const mset = new Mset(canvas);

        mset.bgBlack().fillPage(setScale, setCoordX, setCoordY);

        canvas.addEventListener("mousedown", e => {
            const scrollWidth = 6;
            if (!mset.animation && e.button === 0) {
                const order = mset.scale.toString().length + 2;
                mset.w = canvas.scrollWidth - scrollWidth;
                mset.h = canvas.scrollHeight - scrollWidth;
                const updatedCenter = {
                    x: (e.offsetX - mset.w / 2) / mset.scale,
                    y: (e.offsetY - mset.h / 2) / mset.scale
                };
                mset.center.x += updatedCenter.x;
                mset.center.y += updatedCenter.y;
                mset.scale *= mset.zoom;
                mset.center.x = +mset.center.x.toFixed(order);
                mset.center.y = +mset.center.y.toFixed(order);
                mset.counter = 0;
                mset.bgBlack();
                mset.fillPage(setScale, setCoordX, setCoordY);
                mset.start();
            }

        });

        startBtn.addEventListener("click", () => {
            const scrollWidth = 6;
            if (!mset.animation) {
                mset.w = canvas.scrollWidth - scrollWidth;
                mset.h = canvas.scrollHeight - scrollWidth;
                mset.fillPage(setScale, setCoordX, setCoordY);
                mset.start();
            }
        });

        orderSelect.addEventListener("change", () => {
            mset.clear();
            mset.center.x = 0;
            mset.center.y = 0;
            mset.scale = 250;
            mset.orderZ = orderSelect.value;
        });
        zoomInBtn.addEventListener("click", () => {
            if (!mset.animation) {
                mset.zoomIn();
                mset.fillPage(setScale, setCoordX, setCoordY);
            }
        });
        zoomOutBtn.addEventListener("click", () => {
            if (!mset.animation) {
                mset.zoomOut();
                mset.fillPage(setScale, setCoordX, setCoordY);
            }
        });

        setCoordY.addEventListener("change", () => {
            mset.scale = setScale.value;
            mset.center.x = +setCoordX.value;
            mset.center.y = +setCoordY.value;
        });

        if (typeof window !== 'undefined') {
            if (window.clearBtn) window.clearBtn(mset);
            if (window.stopBtn) window.stopBtn(mset);
        }

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
        };
        direction.forEach(coord => getRange(coord));
        range.forEach(coord => {
            coord.y = range[this.counter].x;
            data.push(coord);
            data.push({ 'x': coord.x, 'y': -1 * coord.y });
        });
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
        });
    }
    isBelongsToSet(order) {
        const outSet = [];
        const setColor = (x, y, i) => {
            let color = 'red';
            switch (true) {
                case i <= 12:
                    color = 'rgb(' + i * 11 + ',' + Math.floor(i * i / 2 + 10) + ',' + (i * 12) + ')';
                    break;
                case i <= 25:
                    color = 'rgb(' + i * 10 + ',' + Math.floor(i / 2 + 25) + ',' + (i * 12) + ')';
                    break;
                case i <= 50:
                    color = 'rgb(' + Math.floor(i * 10 - (x + y) / 22)
                        + ',' + Math.floor(i * 10 + x / 10) + ',' + Math.floor(i * 10 + y / 10) + ')';
                    break;
                case i <= 100:
                    color = 'rgb(' + Math.floor(i * 2.33) + ',' + Math.floor(i * 0.67) + ',' + i + ')';
                    break;
                case i <= 255:
                    color = 'rgb(' + Math.floor(i / 5) + ',' + i + ',' + Math.floor(i / 10) + ')';
                    break;
                case i <= 560:
                    color = 'rgb(' + Math.floor(i / 3.14) + ',' + Math.floor(i * 0.33) + ',' + Math.floor(i / 12) + ')';
                    break;
                case i <= 815:
                    color = 'rgb(' + Math.floor(i / 6.28) + ',' + Math.floor(i * 0.22) + ',' + Math.floor(i / 18) + ')';
                    break;
                case i < 1000:
                    color = 'rgb(100, 180, 230)';
                    break;
            }
            return color;
        };

        this.toComplex(order).forEach(c => {
            let z = [];
            let x = 0;
            let y = 0;
            let pixel = {};
            z[0] = c;
            for (let i = 1; i <= 1000; i++) {
                z[i] = c.add(z[i - 1].pow(this.orderZ));
                if (z[i].re >= 4 || !isFinite(z[i].im) || isNaN(z[i].re) || isNaN(z[i].im)) {
                    x = (c.re - this.center.x) * this.scale + this.w / 2;
                    y = (c.im - this.center.y) * this.scale + this.h / 2;
                    pixel = {
                        'x': x,
                        'y': y,
                        're': c.re,
                        'im': c.im,
                        'i': i,
                        'color': setColor(x, y, i)
                    };
                    outSet.push(pixel);
                    break;
                };
            };
        });
        return outSet;
    }
    bgBlack() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        return this;
    }
    fillPage(setScale, setCoordX, setCoordY) {
        setScale.value = this.scale;
        setCoordX.value = this.center.x;
        setCoordY.value = this.center.y;
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
        const id = this.center.x + ':' + this.center.y + ':' + this.scale;
        this.imgData[id] ?
            this.ctx.putImageData(this.imgData[id], 0, 0) :
            this.animation = setInterval(() => this.draw(), 250);
    }
    stop() {
        clearInterval(this.animation);
        this.animation = false;
    }
    clear() {
        this.stop();
        this.bgBlack();
        this.animation = false;
        this.counter = 0;
        this.imgData = {};
    }
    imageDataSave() {
        const id = this.center.x + ':' + this.center.y + ':' + this.scale;
        this.imgData[id] = this.ctx.getImageData(0, 0, this.w, this.h);
        for (foundId in this.imgData) {
            if (foundId === id) break;
            this.imgData[id] = this.ctx.getImageData(0, 0, this.w, this.h);
        }
    }
    zoomIn() {
        this.imageDataSave();
        this.scale *= this.zoom;
        this.clear();
        this.start();

    }
    zoomOut() {
        this.clear();
        if (this.scale >= 125) this.scale /= this.zoom;
        this.start();
    }
};

if (typeof window !== 'undefined') window.Mset = Mset;

export function init(canvas) { return Mset.init(canvas); }
export default Mset;

