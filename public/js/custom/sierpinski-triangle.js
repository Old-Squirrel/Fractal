const canvas = document.getElementById("layer");
const ctx = canvas.getContext("2d");
canvas.style.width = '90%';
canvas.style.height = '90%';

const counter = document.getElementById('counter');
const counterSpan = document.getElementById('counter-value');
const divider = document.getElementById('divider');
const dividerSpan = document.getElementById('divider-value');
const velocity = document.getElementById('velocity');
const velocitySpan = document.getElementById('velocity-value')

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');

const startPoints = [
    { x: 441, y: 88 },
    { x: 260, y: 540 },
    { x: 732, y: 409 },
    { x: 471, y: 850 },
    { x: 220, y: 260 },
    { x: 760, y: 192 },
    { x: 361, y: 709 },
    { x: 804, y: 329 }
];

const defaultPoint = { x: 590, y: 369 };

const appEvents = {};

const subscribe = (event, callback) => {
    if (!appEvents[event]) {
        appEvents[event] = [];
    }
    appEvents[event].push(callback);
};

const publish = (event, payload) => {
    if (appEvents[event]) {
        appEvents[event].forEach(callback => callback(payload));
    }

};

const defaultState = {
    state: null,
    intId: null, //interval id
    n: 3,
    d: 0.5,
    v: 60
};

const appState = (state => data => {
    if (data !== undefined) {
        publish('stateUpdate', state = Object.assign(state, data));
    }
    return state;
})(defaultState);

const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const drawFilledCircle = (centerX, centerY, radius, color, textColor, text) => {
    ctx.beginPath();
    ctx.fillStyle = textColor;
    ctx.font = 'italic 15pt Calibri';
    ctx.textAlign = 'right';
    ctx.fillText(text, centerX - 10, centerY);
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    ctx.fill();
};

const clear = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawStartPoints = n => {
    clear();
    for (let i = 0; i < n; i++) {
        drawFilledCircle(startPoints[i].x, startPoints[i].y, 4, 'blue', 'black', letters[i]);
    }
    drawFilledCircle(defaultPoint.x, defaultPoint.y, 5, 'red', 'black', 'StartPoint');
};

const drawPoint = ((x, y) => (n, d) => {
    const randomElement = Math.floor(Math.random() * n);

    x = (x + startPoints[randomElement].x) * d;
    y = (y + startPoints[randomElement].y) * d;

    drawFilledCircle(x, y, 2, 'green', '', '');
})(defaultPoint.x, defaultPoint.y);

const draw = () => setInterval(() => drawPoint(appState().n, appState().d),(600 / appState().v));

// App Actions

const start = () => {
    if (appState().state === 'init' || appState().state === 'stop') {

        appState({ state: 'start', intId: draw() });
    }
};

const stop = () => {
    if (appState().state === 'start') {

        clearTimeout(appState().intId);
        appState({ state: 'stop', intId: null });
    }
};

const init = () => {

    if (appState().state === 'start') {
        stop();
    }
    appState({ state: 'init' });
    drawStartPoints(appState().n);
};

// App Listeners

subscribe('stateUpdate', ({ state, n, d, v }) => {
    // switch (state) {
    //     case 'init':
    //         stopBtn.style.display = 'none';
    //         startBtn.style.display = 'inline-block';
    //         break;
    //     case 'start':
    //         startBtn.style.display = 'none';
    //         stopBtn.style.display = 'inline-block';
    //         break;
    //     case 'stop':
    //         stopBtn.style.display = 'none';
    //         startBtn.style.display = 'inline-block';
    //         break;

    // }

    counter.setAttribute('value', n);
    counterSpan.innerText = n;

    divider.setAttribute('value', d);
    dividerSpan.innerText = d;

    velocity.setAttribute('value', v);
    velocitySpan.innerText = v;
});

// Enter

init();

// DOM Listeners

counter.addEventListener("input", ({ target: { value } }) => appState({ n: value }) && drawStartPoints(appState().n));

divider.addEventListener("input", ({ target: { value } }) => appState({ d: value }));

velocity.addEventListener("input", ({ target: { value } }) => appState({ v: value }));

startBtn.addEventListener("click", start);

stopBtn.addEventListener("click", stop);

clearBtn.addEventListener('click', init);


