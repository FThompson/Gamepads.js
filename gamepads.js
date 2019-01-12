class GamepadHandler {
    constructor() {
        if (GamepadHandler._instance) {
            return GamepadHandler._instance
        }
        this.gamepads = {}
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

    stop() {
        this.paused = true
    }

    poll() {
        // must call getGamepads() to force each gamepad object to update for some browsers (Chrome)
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : []
        let connectedIndices = []
        for (let index in gamepads) {
            let gamepad = gamepads[index]
            if (index && gamepad !== null) {
                if (gamepad.index !== undefined) {
                    if (gamepad.index in this.gamepads) {
                        this.gamepads[gamepad.index].update()
                    } else {
                        this.gamepads[gamepad.index] = new Gamepad(gamepad)
                        this.callbacks['connect'].forEach(callback => callback(this.gamepads[gamepad.index]))
                    }
                }
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
        if (!this.paused) {
            this.poll()
            requestAnimationFrame(() => this._run(this))
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
        // this code assumes that axes come in pairs (e.g. for joysticks)
        let callbackMap = this.callbacks['joystickmove']
        for (let i = 0; i < newValues.length; i += 2) {
            let newHorizontal = this._applyDeadzone(newValues[i])
            let newVertical = this._applyDeadzone(newValues[i + 1])
            let oldHorizontal = this._applyDeadzone(oldValues[i])
            let oldVertical = this._applyDeadzone(oldValues[i + 1])
            if (newHorizontal !== oldHorizontal || newVertical !== oldVertical) {
                let axes = [i, i + 1]
                let callListener = callback => callback(axes, [newHorizontal, newVertical])
                callbackMap.forEach((callbacks, indices) => {
                    if (axes.every((value, i) => value === indices[i])) {  // if array key is equal to indices array
                        callbacks.forEach(callListener)  // specific listeners
                    }
                    if (indices === -1) {
                        callbacks.forEach(callListener)  // non-specific listeners
                    }
                })
            }
        }
    }

    _applyDeadzone(value) {
        return Math.abs(value) > this.deadzone ? value : 0
    }

    _compareButtons(newValues, oldValues) {
        this._checkValues(this.callbacks['buttonpress'], newValues, oldValues, (nv, ov) => nv.pressed && !ov.pressed)
        this._checkValues(this.callbacks['buttonrelease'], newValues, oldValues, (nv, ov) => !nv.pressed && ov.pressed)
        this._checkValues(this.callbacks['buttonaxischange'], newValues, oldValues, (nv, ov) => nv.value !== ov.value, true)
    }

    _checkValues(callbackMap, newValues, oldValues, predicate, passValue) {
        for (let i = 0; i < newValues.length; i++) {
            if (predicate(newValues[i], oldValues[i])) {
                let callListener = callback => passValue ? callback(i, newValues[i].value) : callback(i)
                if (callbackMap.has(i)) {
                    callbackMap.get(i).forEach(callListener)  // specific listeners
                }
                if (callbackMap.has(-1)) {
                    callbackMap.get(-1).forEach(callListener)  // non-specific listeners
                }
            }
        }
    }

    // event types: buttonpress, buttonrelease, buttonaxischange, joystickmove
    // for buttonpress/buttonrelase, callback()
    // for buttonaxischange event, callback(value)
    // for joystickmove event, index [indexH, indexV] and callback(horizontal, vertical)
    // specify index to track only a specific button
    addEventListener(type, listener, index=-1) {
        if (!this.callbacks[type].has(index)) {
            this.callbacks[type].set(index, [])
        }
        this.callbacks[type].get(index).push(listener)
    }
    
    removeEventListener(type, listener, index=-1) {
        let filtered = this.callbacks[type].get(index).filter(callback => callback !== listener)
        this.callbacks[type].set(index, filtered)
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
