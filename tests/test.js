let myGamepad = null

gamepads.addEventListener('connect', event => {
    let gamepad = event.gamepad
    console.log('gamepad connected')
    console.log(gamepad)
    gamepad.addEventListener('buttonpress', showPressedButton)
    gamepad.addEventListener('buttonrelease', removePressedButton)
    gamepad.addEventListener('buttonpress', printPressed)
    gamepad.addEventListener('buttonrelease', printReleased)
    gamepad.addEventListener('buttonvaluechange', printButtonValue)
    gamepad.addEventListener('axischange', printAxisValue)
    gamepad.addEventListener('buttonpress', printYPressed, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonrelease', printYReleased, StandardMapping.Button.BUTTON_TOP)
    gamepad.addEventListener('buttonvaluechange', printLTValue, StandardMapping.Button.TRIGGER_RIGHT)
    gamepad.addJoystickEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_LEFT)
    gamepad.addEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_RIGHT)
    myGamepad = gamepad
    console.log(myGamepad._callbacks)
})
gamepads.addEventListener('disconnect', event => {
    console.log('gamepad disconnected')
    console.log(event.gamepad)
})
gamepads.start()

window.addEventListener('load', () => {
    document.getElementById('r').addEventListener('click', () => {
        myGamepad.removeEventListener('buttonpress', printPressed)
        myGamepad.removeEventListener('buttonrelease', printReleased)
        myGamepad.removeEventListener('buttonvaluechange', printButtonValue)
        myGamepad.removeEventListener('axischange', printAxisValue)
        myGamepad.removeEventListener('buttonpress', printYPressed, StandardMapping.Button.BUTTON_TOP)
        myGamepad.removeEventListener('buttonrelease', printYReleased, StandardMapping.Button.BUTTON_TOP)
        myGamepad.removeEventListener('buttonvaluechange', printLTValue, StandardMapping.Button.TRIGGER_RIGHT)
        myGamepad.removeEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_LEFT)
        myGamepad.removeEventListener('joystickmove', printJoystick, StandardMapping.Axis.JOYSTICK_RIGHT)
        myGamepad.removeEventListener('buttonpress', showPressedButton)
        myGamepad.removeJoystickEventListener('buttonrelease', removePressedButton)
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

function showPressedButton(e) {
    let button = gamepadMappings.getButton('Xbox One', e.index)
    if (button) {
        let img = document.createElement('img')
        img.src = button.buttonImageSrc
        img.alt = button.buttonName
        img.setAttribute('buttonIndex', e.index)
        document.getElementById('pressedButtons').append(img)
    }
}

function removePressedButton(e) {
    let img = document.querySelector('#pressedButtons img[buttonIndex="' + e.index + '"]')
    if (img) {
        img.parentNode.removeChild(img)
    }
}

function printPressed(e) {
    console.log(`${e.index} pressed`)
}

function printReleased(e) {
    console.log(`${e.index} released`)
}

function printButtonValue(e) {
    console.log(`button axis ${e.index} is ${e.value}`)
}

function printAxisValue(e) {
    console.log(`axis ${e.index} is ${e.value}`)
}

function printJoystick(e) {
    console.log(`Joystick [${e.horizontalIndex}, ${e.verticalIndex}] is [${e.horizontalValue}, ${e.verticalValue}]`)
}

function printYPressed(e) {
    console.log('pressed Y button')
    e.consume()
}

function printYReleased(e) {
    console.log('released Y button')
    e.consume()
}

function printLTValue(e) {
    console.log(`LT is ${e.value}`)
    e.consume()
}

function printRightJoystick(e) {
    console.log(`RS is ${e.horizontalValue}, ${e.verticalValue}`)
}
