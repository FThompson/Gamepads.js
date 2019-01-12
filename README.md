# HTML5 Gamepad API Enhancements

A simple JavaScript module for tracking Gamepads and events pertaining to their usage.

### Why use this library instead of the existing Gamepad standard?

The [existing Gamepad standard](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API) lacks support for button/joystick events and `gamepadconnected`/`gamepaddisconnected` events do not work consistently across browsers. This module serves to offer a standard event-handling implementation across multiple browsers.

## Example ##

```javascript
import gamepads from './gamepads.js'

gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    gamepad.addEventListener('buttonpress', (i) => {
        console.log(`${i} pressed`)
    })
    gamepad.addEventListener('joystickmove', (indices, values) => {
        console.log(`${indices} is ${values}`
    })
})
gamepads.addEventListener('disconnect', (gamepad) => {
    console.log('gamepad disconnected')
})
gamepads.start()
```

# Usage #

## `GamepadHandler` object ##

```javascript
import gamepads from `./gamepads.js`
```

A `GamepadHandler` instance is the default export of this module (`import gamepads`). This object takes care of polling the HTML5 API for gamepads and tracking which gamepads are currently connected.

### Methods ###

```javascript
gamepads.addEventListener(event, callback)
```

Adds an event listener to the page's gamepad handler.

```javascript
gamepads.removeEventListener(event, callback)
```

Removes an event listener from the page's gamepad handler.

#### Events ####

* `event 'connect': callback(gamepad)`

   Fires when a gamepad is connected or accessed for the first time (if already physically connected).

* `event 'disconnect': callback(gamepad)`

   Fires when a gamepad is disconnected.

```javascript
gamepads.start()
```

Begins polling and updating available Gamepads at the screen frame rate.

```javascript
gamepads.poll()
```

Polls and updates all available Gamepads. You may call this manually (via `setInterval` for example) if you need the module to update gamepads at a different rate than the screen frame rate.

```javascript
gamepads.stop()
```

Pauses polling and updating of gamepads. May be resumed by `start()`.

### Properties ###

```javascript
gamepads.gamepads
```

The map of all connected `Gamepad` objects `{ index: gamepad }`.

## `Gamepad` object ##

Retrieve `Gamepad` instances via `GamepadHandler`'s `connect`/`disconnect` events or `GamepadHandler.gamepads`.

### Methods ###

```javascript
gamepad.addEventListener(event, callback[, index])
```

Adds an event listener to this gamepad. If `index` is supplied, the listener will apply only to events for the button at that index. In the case of `'joystickmove'` events, a two-item array should be passed to `index` to handle two-axis joysticks.

```javascript
gamepad.removeEventListener(event, callback[, index])
```

Removes an event listener from this gamepad. If `index` is supplied, the listener will only be removed from the button at that index. In the case of `'joystickmove'` events, a two-item array should be passed to `index` to handle two-axis joysticks.

#### Events ####

* `event 'buttonpress': callback(index)`

   Fires when a button is pressed and passes the button `index` to the callback.

* `event 'buttonrelease': callback(index)`

   Fires when a button is released and passes the button `index` to the callback.

* `event 'buttonaxischange': callback(index, value)`

   Fires when an axis button (e.g. a trigger) changes and passes the button `index` and `value` (between `0` and `1`) to the callback.

* `event 'joystickmove': callback(indices, values)`

   Fires when a joystick moves outside of the gamepad's deadzone and passes the axis `indices` and axis `values` (between `0` and `1 - gamepad.deadzone`).

```javascript
gamepad.update()
```

Updates this gamepad's values and fires events if necessary.

### Properties ###

```javascript
gamepad.deadzone
```

The joystick deadzone to apply. Defaults to `0.10`. Must be set to range `[0, 1)`.

## `StandardMapping` dictionary ##

A dictionary object containing button/axis `index` values for the `standard` gamepad mapping



# Limitations #

* The HTML5 Gamepad API may perform differently between browsers. Tested only on Ubuntu 18.10 with Chrome (71) and Firefox (64). Firefox considers XB1 triggers and D pad to be axes instead of buttons, and they are incorrectly picked up as `joystickmove` events. `StandardMapping` will also need to be updated to reflect this difference.
* Tested only with an Xbox One controller. Many gamepads share the same standard layout and likely work without additional configuration, but non-standard gamepads will need to be mapped by users of this module.

# TODO #

* Haptic Actuator support. Currently an experimental API internally, so a different implementation may be required per browser engine.
* Button mappings for common controllers