let style = window.getComputedStyle(document.body);
const CONTAINER_SIZE = parseFloat(style.getPropertyValue('--joystick-container-size'));
const DOT_SIZE = parseFloat(style.getPropertyValue('--joystick-size'));
const DOT_POSITION = (CONTAINER_SIZE - DOT_SIZE) / 2;

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
    e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
            StandardMapping.Axis.JOYSTICK_LEFT);
    e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
            StandardMapping.Axis.JOYSTICK_RIGHT);
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
    count--;
    document.getElementById('count').textContent = count;
});

moveJoystick([0, 0], true);
moveJoystick([0, 0], false);
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

function moveJoystick(values, isLeft) {
    let id = (isLeft ? 'left' : 'right');
    let joystick = document.getElementById(id + '-joystick');
    let x = DOT_POSITION + CONTAINER_SIZE / 2 * values[0];
    let y = DOT_POSITION + CONTAINER_SIZE / 2 * values[1];
    joystick.style.top = y + 'px';
    joystick.style.left = x + 'px';
}