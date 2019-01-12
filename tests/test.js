import gamepads, { StandardMapping } from '../gamepads.js'

let myGamepad = null

gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    console.log(gamepad)
    myGamepad = gamepad
    gamepad.addEventListener('buttonpress', printPressed)
    gamepad.addEventListener('buttonrelease', printReleased)
    gamepad.addEventListener('buttonaxischange', printValue)
    gamepad.addEventListener('joystickmove', printJoystick)
    gamepad.addEventListener('buttonpress', printYPressed, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonrelease', printYReleased, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonaxischange', printLTValue, StandardMapping.Button.TRIGGER_RIGHT)
    gamepad.addEventListener('joystickmove', printRightJoystick, StandardMapping.Axis.JOYSTICK_RIGHT)
})
gamepads.addEventListener('disconnect', (gamepad) => {
    console.log('gamepad disconnected')
    console.log(gamepad)
})
gamepads.start()

window.addEventListener('load', () => {
    document.getElementById('r').addEventListener('click', () => {
        myGamepad.removeEventListener('buttonpress', printPressed)
        myGamepad.removeEventListener('buttonrelease', printReleased)
        myGamepad.removeEventListener('buttonaxischange', printValue)
        myGamepad.removeEventListener('joystickmove', printJoystick)
        myGamepad.removeEventListener('buttonpress', printYPressed, StandardMapping.Button.BUTTON_TOP)
        myGamepad.removeEventListener('buttonrelease', printYReleased, StandardMapping.Button.BUTTON_TOP)
        myGamepad.removeEventListener('buttonaxischange', printLTValue, StandardMapping.Button.TRIGGER_RIGHT)
        myGamepad.removeEventListener('joystickmove', printRightJoystick, StandardMapping.Axis.JOYSTICK_RIGHT)
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

function printPressed(i) {
    console.log(`${i} pressed`)
}

function printReleased(i) {
    console.log(`${i} released`)
}

function printValue(i, value) {
    console.log(`${i} is ${value}`)
}

function printJoystick(i, values) {
    console.log(`Joystick [${i[0]}, ${i[1]}] is [${values[0]}, ${values[1]}]`)
}

function printYPressed(i) {
    console.log('pressed Y button')
}

function printYReleased(i) {
    console.log('released Y button')
}

function printLTValue(i, value) {
    console.log(`LT is ${value}`)
}

function printRightJoystick(i, values) {
    console.log(`RS is ${values[0]}, ${values[1]}`)
}
