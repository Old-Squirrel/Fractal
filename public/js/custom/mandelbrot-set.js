
function Mset(canvas) {
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.scale = 250;
    this.orderZ = 2;
    this.pixelSize = 0.5;
    this.center = { 'x': this.w / 2, 'y': this.h / 2 };
    this.order = this.scale.toString().length + 1;
    this.animation = false;
    this.counter = 0;
    this.position = this.defineNextData();
    this.imgData = {};
    this.zoom = 2;



};
Mset.prototype.step = function () {
    switch (true) {
        case this.scale <= 2000: return 0.5
        case this.scale <= 20000 && this.scale >= 2000: return 0.35
        case this.scale <= 80000 && this.scale >= 20000: return 0.2
    }
    return 100 / this.scale;
};

Mset.prototype.defineData = function (offX = 0, offY = 0) {
    let data = [];
    for (let x = offX; x <= offX + this.step() * 100; x += this.step()) {
        for (let y = offY; y <= offY + this.step() * 100; y += this.step()) {
            data.push({ 'x': x / this.scale, 'y': y / this.scale })
        }
    };
    return data
};


Mset.prototype.defineNextData = function () {
   
    let x = [],
        y = [],
        position = [];
    for (let i = -1; i <= 100; i++) {
        x.push(i * this.step() * 25);
        y.unshift(i * this.step() * 25);
        x.map(c => {
            position.push([c, x[0]]);
            position.push([c, y[0]]);
            position.push([y[0], c]);
            position.push([x[0], c]);
            return c;
        });
        y.map(c => {
            position.push([y[0], c]);
            position.push([x[0], c]);
            position.push([c, x[0]]);
            position.push([c, y[0]]);
            return c;
        })

    }

    function getUniqueItems() {
        let uniques = [];
        let coordsFound = {};
        for (let i = 0, l = position.length; i < l; i++) {
            let stringified = JSON.stringify(position[i]);
            if (coordsFound[stringified]) { continue; }
            uniques.push(position[i]);
            coordsFound[stringified] = true;
        }
        return uniques;
    }
   
    return getUniqueItems();
};

Mset.prototype.relativeToCenter = function () {

    let data = this.defineData(this.position[this.counter][0], this.position[this.counter][1]);
    data = data.map(c => {
        c.x = c.x - this.center.x / this.scale;
        c.y = c.y - this.center.y / this.scale;
        return c
    })
    this.counter++;
    return data;

};

Mset.prototype.toComplex = function () {
    let data = [];
    if (this.relativeToCenter()) {
        this.relativeToCenter().forEach(c => data.push(new Complex(c.x, c.y)))

        return data.map(c => {
            c.re = +c.re.toFixed(this.order);
            c.im = +c.im.toFixed(this.order);
            return c;
        })
    }

};

Mset.prototype.isBelongsToSet = function () {
    let complex = this.toComplex();
    let outSet = [];
    complex.forEach(c => {
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
    
    return outSet;
};

Mset.prototype.toCoords = function () {
    let data = this.isBelongsToSet();
    data = data.map(dat => {
        dat.x = dat.x * this.scale + this.center.x;
        dat.y = dat.y * this.scale + this.center.y;
        return dat;
    })
    return data;
};


Mset.prototype.bgBlack = function () {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.w, this.h);

}

Mset.prototype.draw = function () {
    let coords = this.toCoords();

    let color = 'red';
    coords.forEach(coord => {
        switch (true) {
            case coord.i <= 10:
                color = 'rgb(' + coord.i * 25 + ',' + coord.i * 5 + ',' + coord.i * 5 + ')';
                break;
            case coord.i <= 25:
                color = 'rgb(' + coord.i + ',' + coord.i * 5 + ',' + coord.i * 10 + ')';
                break;
            case coord.i <= 100:
                color = 'rgb(' + Math.floor(coord.i * 2.5) + ',' + Math.floor(coord.i * 0.5) + ',' + coord.i + ')';
                break;
            case coord.i <= 255:
                color = 'rgb(' + Math.floor(coord.i / 5) + ',' + coord.i + ',' + Math.floor(coord.i / 10) + ')';
                break;
            case coord.i < 1000:
                color = 'rgb(' + Math.floor(coord.x / 20) + ',' + Math.floor(coord.i / 10) + ',' + Math.floor(coord.y / 5) + ')';
                break;
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.moveTo(coord.x, coord.y);
        this.ctx.arc(coord.x, coord.y, this.pixelSize, 0, 2 * Math.PI, true);
        this.ctx.fill();
    })


};

Mset.prototype.start = function () {
    const id = this.center.x + ':' + this.center.y + ':' + this.scale;
    //this.bgBlack();
    this.imgData[id] ? this.ctx.putImageData(this.imgData[id], 0, 0) :
        this.animation = setInterval(() => this.draw(), 250);
};

Mset.prototype.stop = function () {
    clearInterval(this.animation);
};

Mset.prototype.clear = function () {
    this.stop();
    this.bgBlack();
    this.counter = 0;
    this.scale = 250;
    this.center = { 'x': this.w / 2, 'y': this.h / 2 };
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
    this.stop();
    this.bgBlack();
    this.counter = 0;
    this.start();
};

Mset.prototype.zoomOut = function () {
    this.stop();
    this.bgBlack();
    this.counter = 0;
    if (this.scale >= 125) this.scale = this.scale / this.zoom;
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
    layer.style.width = '100%';
    layer.style.height = '100%';
    const mset = new Mset(layer);
    mset.bgBlack();

    layer.addEventListener("mousedown", e => {
        mset.counter = 0;
        mset.center.x = mset.center.x - e.offsetX + mset.center.x;
        mset.center.y = mset.center.y - e.offsetY + mset.center.y;
        mset.scale = mset.scale * 2 * mset.zoom;
        mset.clear();
        mset.start();

    });

    setCoordY.addEventListener("change", () => {
        const order = setCoordY.value.toString().length - 2; // -2 cause of '0.'
        if (order > 0) mset.scale *= 0.5*order;
        mset.center.x = setCoordX.value * mset.scale + mset.w / 2;
        mset.center.y = setCoordY.value * mset.scale + mset.w / 2;


        // console.log(mset.center)
    });

    orderSelect.addEventListener("change", () => mset.orderZ = orderSelect.value);
    startBtn.addEventListener("click", () => mset.start());
    clearBtn.addEventListener("click", () => mset.clear());
    stopBtn.addEventListener("click", () => mset.stop());
    zoomInBtn.addEventListener("click", () => mset.zoomIn());
    zoomOutBtn.addEventListener("click", () => mset.zoomOut());


};
Mset.init();



