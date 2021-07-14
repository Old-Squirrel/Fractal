function Tree(canvas) {

    this.ctx = canvas.getContext("2d");
    this.w = canvas.width;
    this.h = canvas.height;
    this.animation = null;
    this.angle = -Math.PI / 4;
    this.num = 2; // branches number

};


Tree.prototype.drawItSelf = function (x, y, direct, range, i) {
    let newX = x + Math.cos(direct) * range;
    let newY = y + Math.sin(direct) * range;
    let colorOffset = Math.floor(5 * newX / newY);
    let color = 'rgb(' + Math.abs(colorOffset * (10 - i)) + ','
        + Math.abs(colorOffset * (i - 1)) + ','
        + Math.abs(colorOffset * (i - 3)) + ' )';

    this.ctx.lineWidth = 2*i / 5;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(newX, newY);
    this.ctx.stroke();

    switch (true) {

        case this.num == 3 && i > 0:
            this.drawItSelf(newX, newY, direct, range / 2, i - 1);
            this.drawItSelf(newX, newY, direct + this.angle, range / 2, i - 1);
            this.drawItSelf(newX, newY, direct - this.angle, range / 2, i - 1);
            break;

        case this.num == 2 && i > 0:
            this.drawItSelf(newX, newY, direct + this.angle, range / 2, i - 1);
            this.drawItSelf(newX, newY, direct - this.angle, range / 2, i - 1);
            break;
    }
};
Tree.prototype.bgLight = function () {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#F0FFFF';
    this.ctx.fillRect(0, 0, this.w, this.h);
};

Tree.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.bgLight();
    this.drawItSelf(this.w / 2, this.h / 2 + this.h / 3, -Math.PI / 2, this.h / 2.5, 9);
    this.angle += 0.075;
    this.animation = window.requestAnimationFrame(this.draw.bind(this));
    if(this.angle >= Math.PI * 2) this.angle = 0
};


Tree.prototype.start = function () {
    this.animation || this.draw();

};

Tree.prototype.stop = function () {
    window.cancelAnimationFrame(this.animation);
    this.animation = null;

};

Tree.prototype.clear = function () {
    this.stop();
    this.angle = -Math.PI / 4;
    this.bgLight();
}

Tree.init = () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
    const canvas = document.getElementById('layer');
    const branches = document.getElementById('mode-select');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const tree = new Tree(canvas);

    zoomInBtn.style.display='none';
    zoomOutBtn.style.display='none';
    canvas.style.width = '75%';
    canvas.style.height = '75%';
    
    tree.bgLight();
    branches.addEventListener("change", () => {
        if (branches.value == 2 || branches.value == 3) {
            tree.num = branches.value;
            tree.clear();
            return
        }
        tree.num = 2;
        tree.clear()
    });
    startBtn.addEventListener("click", () => tree.start());
    clearBtn.addEventListener("click", () => tree.clear());
    stopBtn.addEventListener("click", () => tree.stop());

    return tree;
};

Tree.init();
