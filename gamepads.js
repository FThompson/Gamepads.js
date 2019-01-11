class GamepadHandler {
    constructor() {
        if (GamepadHandler._instance) {
            return GamepadHandler._instance
        }
        this.gamepads = {}
        this.pollFrequency = 60
        this.paused = false
        this.callbacks = {
            'connect': [],
            'disconnect': []
        }
        GamepadHandler._instance = this
    }

    start() {
        this.paused = false
        this._run()
    }

    pause() {
        this.paused = true
    }

    poll() {
        // must call getGamepads() to force each gamepad object to update for some browsers (Chrome)
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : []
        let connectedIndices = []
        for (let index in gamepads) {
            if (index && gamepads[index] !== null) {
                this._updateGamePad(gamepads[index])
                connectedIndices.push(index)
            }
        }
        // check if any tracked gamepads are now absent/disconnected from the browser's gamepads
        for (let index in this.gamepads) {
            if (!connectedIndices.includes(index)) {
                this.callbacks['disconnect'].forEach(callback => callback(this.gamepads[index]))
                delete this.gamepads[index]
            }
        }
    }

    // connect: callback(gamepad)
    // disconnect: callback(gamepad)
    addEventListener(type, listener) {
        this.callbacks[type].push(listener)
    }

    removeEventListener(type, listener) {
        this.callbacks[type] = this.callbacks[type].filter(callback => callback !== listener)
    }

    _run() {
        this.poll()
        if (!this.paused) {
            setTimeout(() => this._run(this), 1000 / this.pollFrequency)
        }
    }

    _updateGamePad(gamepad) {
        if (gamepad.index !== undefined) {
            if (gamepad.index in this.gamepads) {
                this.gamepads[gamepad.index].update()
            } else {
                this.gamepads[gamepad.index] = new Gamepad(gamepad)
                this.callbacks['connect'].forEach(callback => callback(this.gamepads[gamepad.index]))
            }
        }
    }
}

class Gamepad {
    constructor(gamepad) {
        this.gamepad = gamepad
        this.callbacks = {  // map required for array keys on joystick, used for convenience elsewhere
            'buttonpress': new Map(),
            'buttonrelease': new Map(),
            'buttonaxischange': new Map(),
            'joystickmove': new Map()
        }
        this._setLastValues()
    }

    _setLastValues() {
        this._last = {
            connected: this.gamepad.connected,
            axes: this.gamepad.axes.slice(),
            buttons: Object.keys(this.gamepad.buttons).map(i => {
                return {
                    'pressed': this.gamepad.buttons[i].pressed,
                    'value': this.gamepad.buttons[i].value
                }
            })
        }
    }

    get deadzone() {
        return this._deadzone || 0.10
    }

    set deadzone(deadzone) {
        if (deadzone >= 1.0 || deadzone < 0) {
            throw Error('deadzone must be in range [0, 1)')
        }
        this._deadzone = deadzone
    }

    update() {
        if (this.gamepad.connected && this._last.connected) {  // compare only against recent connected frame
            this._compareButtons(this.gamepad.buttons, this._last.buttons)
            this._compareAxes(this.gamepad.axes, this._last.axes)
        }
        this._setLastValues()
    }

    _compareAxes(newValues, oldValues) {
        this.callbacks['joystickmove'].forEach((callbacks, indices) => {
            let newHorizontal = this._applyDeadzone(newValues[indices[0]])
            let newVertical = this._applyDeadzone(newValues[indices[1]])
            let oldHorizontal = this._applyDeadzone(oldValues[indices[0]])
            let oldVertical = this._applyDeadzone(oldValues[indices[1]])
            if (newHorizontal !== oldHorizontal || newVertical !== oldVertical) {
                callbacks.forEach(callback => {
                    return callback([newHorizontal, newVertical], [oldHorizontal, oldVertical])
                })
            }
        })
    }

    _applyDeadzone(value) {
        return Math.abs(value) > this.deadzone ? value : 0
    }

    // TODO: optimization to avoid wrecking cpu at high poll rates
    // currently iterating thru callbacks to supposedly save cpu for application with few callback needs
    // should this iterate through buttons instead regardless of callbacks registered?
    // or should Gamepad track separately which buttons have callbacks and only check those?
    _compareButtons(newValues, oldValues) {
        this._checkValues(this.callbacks['buttonpress'], newValues, oldValues, (nv, ov) => nv.pressed && !ov.pressed)
        this._checkValues(this.callbacks['buttonrelease'], newValues, oldValues, (nv, ov) => !nv.pressed && ov.pressed)
        this._checkValues(this.callbacks['buttonaxischange'], newValues, oldValues, (nv, ov) => nv.value !== ov.value, true)
    }

    _checkValues(callbackMap, newValues, oldValues, predicate, passValue) {
        callbackMap.forEach((callbacks, index) => {
            if (predicate(newValues[index], oldValues[index])) {
                callbacks.forEach(callback => passValue ? callback(newValues[index].value) : callback())
            }
        })
    }

    // event types: buttonpress, buttonrelease, buttonaxischange, joystickmove
    // for buttonpress/buttonrelase, callback()
    // for buttonaxischange event, callback(value)
    // for joystickmove event, index [indexH, indexV] and callback(horizontal, vertical)
    // TODO: reconsider, is index necessary here or should the button be passed to the callback?
    addEventListener(type, listener, index=-1) {
        if (!this.callbacks[type].has(index)) {
            this.callbacks[type].set(index, [])
        }
        this.callbacks[type].get(index).push(listener)
    }
    
    removeEventListener(type, listener, index) {
        this.callbacks[type].delete(index)
        // this.callbacks[type][index] = this.callbacks[type][index].filter(callback => callback !== listener)
    }
}

export const StandardMapping = {
    Button: {
        BUTTON_BOTTOM: 0,
        BUTTON_RIGHT: 1,
        BUTTON_LEFT: 2,
        BUTTON_TOP: 3,
        BUMPER_LEFT: 4,
        BUMPER_RIGHT: 5,
        TRIGGER_LEFT: 6,
        TRIGGER_RIGHT: 7,
        BUTTON_CONTROL_LEFT: 8,
        BUTTON_CONTROL_RIGHT: 9,
        BUTTON_JOYSTICK_LEFT: 10,
        BUTTON_JOYSTICK_RIGHT: 11,
        D_PAD_UP: 12,
        D_PAD_BOTTOM: 13,
        D_PAD_LEFT: 14,
        D_PAD_RIGHT: 15,
        BUTTON_CONTROL_MIDDLE: 16,
    },

    // negative left and up, positive right and down
    Axis: {
        JOYSTICK_LEFT_HORIZONTAL: 0,
        JOYSTICK_LEFT_VERTICAL: 1,
        JOYSTICK_RIGHT_HORIZONTAL: 2,
        JOYSTICK_RIGHT_VERTICAL: 3,
        JOYSTICK_LEFT: [0, 1],
        JOYSTICK_RIGHT: [2, 3]
    }
}

const gamepads = new GamepadHandler()
export default gamepads;
