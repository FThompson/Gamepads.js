let myGamepad = null

gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    console.log(gamepad)
    gamepad.addEventListener('buttonpress', printPressed)
    gamepad.addEventListener('buttonrelease', printReleased)
    gamepad.addEventListener('buttonvaluechange', printButtonValue)
    gamepad.addEventListener('axischange', printAxisValue)
    // gamepad.addEventListener('buttonpress', printYPressed, StandardMapping.Button.BUTTON_TOP)
    // gamepad.addEventListener('buttonrelease', printYReleased, StandardMapping.Button.BUTTON_TOP)
    // gamepad.addEventListener('buttonvaluechange', printLTValue, StandardMapping.Button.TRIGGER_RIGHT)
    gamepad.addEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_LEFT)
    gamepad.addEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_RIGHT)
    myGamepad = gamepad
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
        myGamepad.removeEventListener('buttonvaluechange', printButtonValue)
        myGamepad.removeEventListener('axischange', printAxisValue)
        // myGamepad.removeEventListener('buttonpress', printYPressed, StandardMapping.Button.BUTTON_TOP)
        // myGamepad.removeEventListener('buttonrelease', printYReleased, StandardMapping.Button.BUTTON_TOP)
        // myGamepad.removeEventListener('buttonvaluechange', printLTValue, StandardMapping.Button.TRIGGER_RIGHT)
        myGamepad.removeEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_LEFT)
        myGamepad.removeEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_RIGHT)
        console.log(myGamepad)
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

function printButtonValue(i, value) {
    console.log(`button axis ${i} is ${value}`)
}

function printAxisValue(i, value) {
    console.log(`axis ${i} is ${value}`)
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
