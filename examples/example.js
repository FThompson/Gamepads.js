const DOT_SIZE = 6;
let pressedButtons = {};

gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected:');
    console.log(e.gamepad);
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
});

drawJoystick([0, 0], true);
drawJoystick([0, 0], false);
gamepadMappings.buttonsPath = 'https://cdn.jsdelivr.net/gh/FThompson/gamepads.js@latest/buttons';
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
    let id = (left ? 'left' : 'right') + '-joystick';
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = canvas.width / 2 * (1 + values[0]);
    let y = canvas.height / 2 * (1 + values[1]);
    ctx.fillStyle = 'cyan';
    ctx.fillRect(x - DOT_SIZE, y - DOT_SIZE, DOT_SIZE, DOT_SIZE);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x - DOT_SIZE, y - DOT_SIZE, DOT_SIZE, DOT_SIZE);
}