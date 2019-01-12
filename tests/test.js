import gamepads, { StandardMapping } from '../gamepads.js'

let myGamepad = null

gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    console.log(gamepad)
    myGamepad = gamepad
    gamepad.addEventListener('buttonpress', iPrintPressed)
    gamepad.addEventListener('buttonrelease', iPrintReleased)
    gamepad.addEventListener('buttonaxischange', iPrintValue)
    gamepad.addEventListener('buttonpress', printPressed, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonrelease', printReleased, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonaxischange', printValue, StandardMapping.Button.TRIGGER_RIGHT)
    gamepad.addEventListener('joystickmove', printValue, StandardMapping.Axis.JOYSTICK_RIGHT)
})
gamepads.addEventListener('disconnect', (gamepad) => {
    console.log('gamepad disconnected')
    console.log(gamepad)
})
gamepads.start()

window.addEventListener('load', () => {
    document.getElementById('r').addEventListener('click', () => {
        myGamepad.removeEventListener('buttonpress', iPrintPressed)
        myGamepad.removeEventListener('buttonrelease', iPrintReleased)
        myGamepad.removeEventListener('buttonaxischange', iPrintValue)
        myGamepad.removeEventListener('buttonpress', printPressed, StandardMapping.Button.BUTTON_TOP)
        myGamepad.removeEventListener('buttonrelease', printReleased, StandardMapping.Button.BUTTON_TOP)
        myGamepad.removeEventListener('buttonaxischange', printValue, StandardMapping.Button.TRIGGER_RIGHT)
        myGamepad.removeEventListener('joystickmove', printValue, StandardMapping.Axis.JOYSTICK_RIGHT)
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

function iPrintPressed(i) {
    console.log(`${i} pressed`)
}

function iPrintReleased(i) {
    console.log(`${i} released`)
}

function iPrintValue(i, value) {
    console.log(`${i} is ${value}`)
}

function printValue(value) {
    console.log(value)
}

function printPressed() {
    console.log('pressed Y button')
}

function printReleased() {
    console.log('released Y button')
}
