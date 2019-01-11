import gamepads, { StandardMapping } from '../gamepads.js'

let myGamepad = null

gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    console.log(gamepad)
    myGamepad = gamepad
    gamepad.addEventListener('buttonpress', pressed, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonrelease', released, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonaxischange', printValue, StandardMapping.Button.TRIGGER_RIGHT)
    gamepad.addEventListener('joystickmove', printValue, StandardMapping.Axis.JOYSTICK_RIGHT)
})
gamepads.addEventListener('disconnect', (gamepad) => {
    console.log('gamepad disconnected')
    console.log(gamepad)
})
gamepads.start()

function printValue(value) {
    console.log(value)
}

function pressed() {
    console.log('pressed Y button')
}

function released() {
    console.log('released Y button')
}

window.addEventListener('load', () => {
    document.getElementById('r').addEventListener('click', () => {
        myGamepad.removeEventListener('buttonpress', pressed, StandardMapping.Button.BUTTON_TOP)
        myGamepad.removeEventListener('buttonrelease', released, StandardMapping.Button.BUTTON_TOP)
    })
    document.getElementById('c').addEventListener('click', () => {
        console.log(gamepads)
    })
    document.getElementById('p').addEventListener('click', () => {
        gamepads.stop()
    })
    document.getElementById('s').addEventListener('click', () => {
        gamepads.start()
    })
})
