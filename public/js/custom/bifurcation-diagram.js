function Diagram(canvas) {
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.x = this.w * 0.05;  //start position
    this.y = this.h - this.h * 0.05;
    this.initValue = 0.6;         // 0 >= initValue <= 1
    this.step = 0.001;
    this.r = -this.step;
    this.scale = (this.w - this.x) / 5;
    this.animation = null;
    this.pixelSize = 0.1; 
    this.bufferSize = 25;
}



Diagram.prototype.axis = function () {
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000000';
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x, 0);
    this.ctx.lineTo(this.x - 5, 10)
    this.ctx.moveTo(this.x, 0);
    this.ctx.lineTo(this.x + 5, 10);
    this.ctx.lineTo(this.x - 5, 10);
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.w, this.y);
    this.ctx.lineTo(this.w - 10, this.y - 5);
    this.ctx.moveTo(this.w, this.y);
    this.ctx.lineTo(this.w - 10, this.y + 5);
    this.ctx.lineTo(this.w - 10, this.y - 5);
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('Xn+1', 0.05 * this.x, this.h * 0.02);
    this.ctx.fillText('R', this.w - this.w * 0.05, this.y + 0.03 * this.y);
    this.ctx.stroke();
    for (let i = 0; i < this.w / this.scale - 1; i++) {
        this.ctx.beginPath();
        this.ctx.font = "15px Arial";
        this.ctx.fillStyle = 'blue';
        this.ctx.fillText(i, this.x + i * this.scale -5, this.y + 0.03 * this.y);
        if (i >= 1) this.ctx.fillText((i / 4).toFixed(2), 0.35 * this.x, this.y - i * this.scale + 5); // avoid double '0'
        this.ctx.fill();
        this.ctx.fillStyle = '#696969';
        this.ctx.arc(this.x + i * this.scale, this.y, 2, 0, 2 * Math.PI, true);
        this.ctx.arc(this.x, this.y - i * this.scale, 2, 0, 2 * Math.PI, true);
        this.ctx.fill();

    }

};
Diagram.prototype.getValue = function* () {
    let data = [];
    let arr = [];
    this.r += this.step;

    switch (true) {
        case this.r <= 1:
            return { x: +this.r.toFixed(4), y: 0 };    // if r<=1 result always be 0, doesn't need to calculate
        
            case this.r <= 4:
            arr[0] = this.initValue;
            for (let i = 1; i < 500; i++) {     //it takes several iterations for the data approximates
                arr[i] = this.r * arr[i - 1] * (1 - arr[i - 1]); //slightly different view of primary equation: Xn+1 = R * Xn * (1 - Xn)
            }
            arr.slice(450, 500).forEach(v => {
                v = v.toFixed(4);
                if (!data.includes(v)) data.push(v)
            });
            data = data.map((v, i, ar) => {
                let arr = [{ x: +this.r.toFixed(4), y: +v }];
                return arr.concat(ar[i])[0];
            });
            yield data;
        
            case this.r > 4:
            this.stop();
            return {x: 'infinity', y: 'infinity'};   // if r >4 result will always be infinity
    }
};

Diagram.prototype.draw = function () {
    let buffer = [];
    let i = 0;
    buffer[0] = this.getValue().next().value;
    while (i < this.bufferSize) {
        buffer = buffer.concat(this.getValue().next().value);
        i++;
    };

    buffer.map(coord => {
        const x = coord.x * this.scale + this.x;
        const y = this.y - coord.y * this.scale * 4;
        return { x, y }
    })
    .forEach(function (coord) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.arc(coord.x, coord.y, this.pixelSize, 0, 2 * Math.PI, true)
        this.ctx.stroke();
    }, this)
};



Diagram.prototype.start = function () {
    this.animation = setInterval(() => this.draw(), 250)
};

Diagram.prototype.stop = function () {
    clearInterval(this.animation);
    this.animation = null;
};

Diagram.prototype.clear = function () {

    this.stop();
    this.r = 0;
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.axis();
}

Diagram.init = function () {
    const canvas = document.getElementById("layer");
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
    canvas.style.width = '100%';
    canvas.style.height = '80%';

    const diagram = new Diagram(canvas);
    startBtn.addEventListener("click", () => {
        if (!diagram.animation) diagram.start()
    });
    clearBtn.addEventListener("click", () => diagram.clear());
    stopBtn.addEventListener("click", () => diagram.stop());

    diagram.axis();

    return diagram;


};
Diagram.init();
