//fractals
import './complex.js';

//register all fractals here
const fractals = {
    path: 'fractal-scripts',
    dir: 'fractals',
    list: [
        'mandelbrot-set-2d', 'fern', 'pythagoras-tree', 'bifurcation-diagram',
        'lichtenberg', 'symmetric-icons', 'newton-fractal','sierpinsky-triangle',
        'buddhabrot', 'fractal-flame'
    ],
    palette: [
        '#fa3062', '#00ffff', '#156472', '#90ee90', '#105710', '#f8e8e8',
        '#db25d2', '#e06c49', '#47c22e', '#852b30', '#ffd700', '#95a318',
        '#ff4500', '#7b1fa2', '#00e5ff', '#ff00ff'
    ]
};

//path must be hardcoded!!!
const fractalModules = import.meta.glob('./fractals/*.js');

const canvasLayer = () => document.getElementById('layer');

const startBtn = fractal => {
    const button = document.getElementById('start-btn');
    if (button) button.addEventListener("click", () => { if (!fractal.animation) fractal.start() });
}
const stopBtn = fractal => {
    const button = document.getElementById('stop-btn');
    if (button) button.addEventListener("click", () => fractal.stop());
}
const clearBtn = fractal => {
    const button = document.getElementById('clear-btn');
    if (button) button.addEventListener("click", () => fractal.clear());
}
const zoomInBtn = fractal => {
    const button = document.getElementById('zoom-in-btn');
    if (button) button.addEventListener("click", () => fractal.zoomIn());
}
const zoomOutBtn = fractal => {
    const button = document.getElementById('zoom-out-btn');
    if (button) button.addEventListener("click", () => fractal.zoomOut());
}

const setColorBtn = fractal => {
    const colorInput = document.getElementById('color-input');
    const colorValue = document.getElementById('color-value');

    if (colorInput && colorValue) {
        colorValue.style.backgroundColor = fractals.palette[1];
        colorValue.style.color = fractals.palette[1];
        colorInput.addEventListener("input", () => {
            colorValue.style.backgroundColor = fractal.setColor(fractals.palette, colorInput.value);
            colorValue.style.color = fractal.setColor(fractals.palette, colorInput.value);
        });
    }

}


const getPathName = () => window.location.pathname;

// Expose helper functions globally for legacy scripts
window.canvasLayer = canvasLayer;
window.startBtn = startBtn;
window.stopBtn = stopBtn;
window.clearBtn = clearBtn;
window.zoomInBtn = zoomInBtn;
window.zoomOutBtn = zoomOutBtn;
window.setColorBtn = setColorBtn;

async function initFractals() {
    const canvas = canvasLayer();

    const pathData = getPathName().split('/').filter(fragment => fragment !== '');

    if (pathData[0] !== fractals.path) return;

    const scriptName = pathData[1];
    if (!fractals.list.includes(scriptName)) return;

    const modulePath = `./${fractals.dir}/${scriptName}.js`;

    if (!(modulePath in fractalModules)) {
        console.error(`no ${modulePath} found `);
        return;
    }

    const m = await fractalModules[modulePath]().catch(() => null);

    if (!m) return;

    if (typeof m.init === 'function') {
        m.init(canvas);
    } else if (m.default && typeof m.default.init === 'function') {
        m.default.init(canvas);
    }
}



if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFractals);
}
else {
    initFractals();
}

export { canvasLayer, startBtn, stopBtn, clearBtn, zoomInBtn, zoomOutBtn, setColorBtn };



