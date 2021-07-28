
function Mset(canvas) {
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.zoom = 2;
    this.scale = 290;
    this.orderZ = 2;
    this.pixelSize = 0.5;
    this.center = { 'x': 0, 'y': 0 };
    this.animation = null;
    this.counter = 0;
    this.imgData = {};
};

Mset.prototype.generateData = function () {
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

};

Mset.prototype.toComplex = function () {
    const data = [];
    const order = this.scale.toString().length + 2;
    const complex = this.generateData().map(coord => {
        coord.x += this.center.x;
        coord.y += this.center.y;
        return coord;
    });
    if (complex) {
        complex.forEach(c => data.push(new Complex(c.x, c.y)))
        return data.map(c => {
            c.re = +c.re.toFixed(order);
            c.im = +c.im.toFixed(order);
            return c;
        })
    }

};

Mset.prototype.isBelongsToSet = function () {
    const data = this.toComplex();
    const outSet = [];
    if (data) {
        data.forEach(c => {
            let z = [];
            z[0] = c;
            for (let i = 1; i <= 1000; i++) {
                z[i] = c.add(z[i - 1].pow(this.orderZ));
                if (z[i].re >= 4 || !isFinite(z[i].im) || isNaN(z[i].re) || isNaN(z[i].im)) {
                    outSet.push({
                        'x': c.re,
                        'y': c.im,
                        'i': i
                    });
                    break;
                };

            };

        });
    };
    return outSet;
};

Mset.prototype.toCoords = function () {
    return this.isBelongsToSet().map(coord => {
        coord.x = (coord.x - this.center.x) * this.scale + this.w / 2;
        coord.y = (coord.y - this.center.y) * this.scale + this.h / 2;
        return coord;
    })

};


Mset.prototype.bgBlack = function () {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.w, this.h);
    return this;
}
Mset.prototype.fillPage = function (setScale, setCoordX, setCoordY) {
    setScale.value = this.scale;
    setCoordX.value = this.center.x;
    setCoordY.value = this.center.y;
    return this;
}

Mset.prototype.draw = function () {
    let color = 'red';
    this.toCoords().forEach(coord => {
        switch (true) {
            case coord.i <= 10:
                color = 'rgb(' + coord.i * 10 + ',' + coord.i * 10 + ',' + coord.i * 25 + ')';
                break;
            case coord.i <= 50:
                color = 'rgb(' + Math.floor(coord.i * 10 - (coord.x + coord.y) / 20)
                    + ',' + Math.floor(coord.i * 10 + coord.x / 10) + ',' + Math.floor(coord.i * 10 + coord.y / 10) + ')';
                break;
            case coord.i <= 100:
                color = 'rgb(' + Math.floor(coord.i * 2.5) + ',' + Math.floor(coord.i * 0.5) + ',' + coord.i + ')';
                break;
            case coord.i <= 255:
                color = 'rgb(' + Math.floor(coord.i / 5) + ',' + coord.i + ',' + Math.floor(coord.i / 10) + ')';
                break;
            case coord.i < 1000:
                color = '#8a9be6';
                break;
        }
        // 'rgb(' + Math.floor(coord.x / 20) + ',' + Math.floor(coord.i / 10) + ',' + Math.floor(coord.y / 5) + ')'
        // let color = '#9b4cd4';
        // let [i,x,y] = [coord.i,coord.x,coord.y]
        // switch (true) {
        //     case i <= 40:
        //         color = 'rgb(' + Math.floor(i * 10 - (x + y) / 20) + ',' + Math.floor(i * 10 + x/10) + ',' + Math.floor(i * 10 + y/10) + ')';
        //         break;
        //     case i <= 60:
        //         color = '#fcfb26';
        //         break;
        //     case i <= 80:
        //         color = '#ff7004';
        //         break;
        //     case i <= 100:
        //         color = '#fd0000';
        //         break;
        //     case i <= 300:
        //         color = '#f50782';
        //         break;
        //     case i <= 500:
        //         color = '#e507f5';
        //         break;
        //     case i <= 800:
        //         color = '#5a07f5';
        //         break;
        // }

        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.moveTo(coord.x, coord.y);
        this.ctx.arc(coord.x, coord.y, this.pixelSize, 0, 2 * Math.PI, true);
        this.ctx.fill();
    })


};

Mset.prototype.start = function () {

    const id = this.center.x + ':' + this.center.y + ':' + this.scale;
    this.imgData[id] ?
        this.ctx.putImageData(this.imgData[id], 0, 0) :
        this.animation = setInterval(() => this.draw(), 250);

};

Mset.prototype.stop = function () {
    clearInterval(this.animation);
    this.animation = false;
};

Mset.prototype.clear = function () {
    this.stop();
    this.bgBlack();
    this.animation = false;
    this.counter = 0;
    this.imgData = {};
};

Mset.prototype.imageDataSave = function () {
    const id = this.center.x + ':' + this.center.y + ':' + this.scale;
    this.imgData[id] = this.ctx.getImageData(0, 0, this.w, this.h);
    for (foundId in this.imgData) {
        if (foundId === id) break;
        this.imgData[id] = this.ctx.getImageData(0, 0, this.w, this.h);
    }
};

Mset.prototype.zoomIn = function () {
    this.imageDataSave();
    this.scale *= this.zoom;
    this.clear();
    this.start();

};

Mset.prototype.zoomOut = function () {
    this.clear();
    if (this.scale >= 125) this.scale /= this.zoom;
    this.start();
};


Mset.init = function () {
    const layer = document.getElementById('layer');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
    const orderSelect = document.getElementById('mode-select');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const setCoordX = document.getElementById('set-coord-x');
    const setCoordY = document.getElementById('set-coord-y');
    const setScale = document.getElementById('set-scale');
    const mset = new Mset(layer);

    mset.bgBlack().fillPage(setScale, setCoordX, setCoordY);


    layer.addEventListener("mousedown", e => {
        if (!mset.animation && e.button === 0) {
            const order = mset.scale.toString().length + 2;
            mset.w = layer.scrollWidth - 6;
            mset.h = layer.scrollHeight - 6;
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
        if (!mset.animation) {
            mset.w = layer.scrollWidth - 6;
            mset.h = layer.scrollHeight - 6;
            mset.fillPage(setScale, setCoordX, setCoordY);
            mset.start();
        }
    });

    clearBtn.addEventListener("click", () => mset.clear());
    stopBtn.addEventListener("click", () => mset.stop());
    orderSelect.addEventListener("change", () => {
        mset.clear();
        mset.center.x = 0;
        mset.center.y = 0;
        mset.scale = 290;
        mset.orderZ = orderSelect.value
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



};
Mset.init();



//-0.777807810193171
//0.131645108003206