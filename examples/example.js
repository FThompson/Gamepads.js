const DOT_SIZE = 6;
let count = 0;
let dots = {};
let pressedButtons = {};

gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    count++;
    document.getElementById('count').textContent = count;
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    e.gamepad.addEventListener('joystickmove', e => drawJoystick(e.values, true),
            StandardMapping.Axis.JOYSTICK_LEFT);
    e.gamepad.addEventListener('joystickmove', e => drawJoystick(e.values, false),
            StandardMapping.Axis.JOYSTICK_RIGHT);
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
    count--;
    document.getElementById('count').textContent = count;
});

drawJoystick([0, 0], true);
drawJoystick([0, 0], false);
gamepadMappings.buttonsPath = '/buttons';
gamepads.start();

function showPressedButton(index) {
    if (!pressedButtons[index]) {
        let button = gamepadMappings.getButton('Xbox One', index);
        if (button) {
            let img = document.createElement('img');
            img.src = button.buttonImageSrc;
            img.alt = button.buttonName;
            document.getElementById('pressed-buttons').append(img);
            pressedButtons[index] = img;
        }
    }
}

function removePressedButton(index) {
    let img = pressedButtons[index];
    if (img) {
        img.parentNode.removeChild(img);
        delete pressedButtons[index];
    }
}

function drawJoystick(values, left) {
    let id = (left ? 'left' : 'right');
    let canvas = document.getElementById(id + '-joystick');
    let ctx = canvas.getContext('2d');
    if (dots[id]) {
        ctx.clearRect(dots[id].x - 1, dots[id].y - 1, DOT_SIZE + 2, DOT_SIZE + 2);
    }
    let x = Math.ceil(canvas.width / 2 * (1 + values[0]));
    let y = Math.ceil(canvas.height / 2 * (1 + values[1]));
    let rect = { x: x - DOT_SIZE / 2, y: y - DOT_SIZE / 2 };
    ctx.fillStyle = 'cyan';
    ctx.fillRect(rect.x, rect.y, DOT_SIZE, DOT_SIZE);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(rect.x, rect.y, DOT_SIZE, DOT_SIZE);
    dots[id] = rect;
}