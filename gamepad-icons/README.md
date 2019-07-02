# Gamepad Icons Module
[![](https://img.shields.io/github/release/fthompson/gamepads.js.svg)](https://github.com/FThompson/Gamepads.js/releases/latest)
[![](https://img.shields.io/bundlephobia/min/gamepad-icons.svg)](https://www.npmjs.com/package/gamepad-icons)
[![](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

GamepadIcons is an extension to Gamepads.js offering gamepad icons for common gamepad mappings.

## Installation

### Via npm

```
npm install gamepad-icons
```

To make the button images available in your app, copy the `node_modules/gamepad-icons/buttons` folder into a location accessible from your code. See [this Stack Overflow answer](https://stackoverflow.com/a/36570555/1247781) showing how to configure Webpack to copy the button assets over automatically.

Then, tell the module where to find the button images:

```javascript
import GamepadIcons from 'gamepad-icons';

GamepadIcons.buttonsPath = 'my/path';
```

Alternatively, you can use jsDelivr CDN for accessing button images:

```javascript
GamepadIcons.buttonsPath = 'https://cdn.jsdelivr.net/gh/FThompson/gamepads.js@1.2.0/gamepad-icons/buttons';
```

### Via script tag

Add the script via jsDelivr or direct download.

```html
<script src='https://cdn.jsdelivr.net/gh/FThompson/gamepads.js@1.2.0/gamepad-icons/gamepad-icons.min.js'></script>
```

You can download the full extension, `gamepad-icons.js.zip` in the Releases tab [here](https://github.com/FThompson/Gamepads.js/releases). This ZIP archive contains the script and a folder containing the button images. Copy the buttons folder to your project and configure the module to find the images.

```javascript
GamepadIcons.buttonsPath = 'my/path';
```

Alternatively, you can use jsDelivr CDN for accessing button images:

```javascript
GamepadIcons.buttonsPath = 'https://cdn.jsdelivr.net/gh/FThompson/gamepads.js@1.2.0/gamepad-icons/buttons';
```

## Usage

```javascript
Gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected');
    console.log(e.gamepad);
    e.gamepad.addEventListener('buttonpress', e => {
        let button = GamepadIcons.getButton('Xbox One', e.index);
        console.log(button);
    });
});
```

You must specify one of the following supported mapping names as the first parameter to `getButton`:
* `"Xbox One"`
* `"Xbox 360"`
* `"PS4"`
* `"PS3"`

The `gamepadMappings.getButton` function returns an object containing `mappingName`, `buttonName` (such as `"Y"`), and `buttonImageSrc`, which is the URL for the button's image starting with the default path `/buttons`. You can change the root path of `buttonImageSrc` by setting `gamepadMappings.buttonsPath`.

### Detecting Gamepad Model

Gamepad objects contain an `id` property that can offer clues to what brand of gamepad is connected, but you cannot rely on this value because some drivers map gamepads to Xbox 360 layouts for compatibility. Instead, you should give users the option to choose which mapping to display and use their selected mapping in `GamepadIcons.getButton` calls throughout your application.

# API Reference

## `GamepadIconHandler` object

```javascript
GamepadIcons
```

A `GamepadIconHandler` singleton is exposed as `GamepadIcons`. This object takes care of querying supported gamepad mappings.

### Methods

```javascript
GamepadIcons.getButton(mappingName, index)
```

Gets the given mapping's button at the given index. Returns an object containing `mappingName` (e.g. `'Xbox One'`), `buttonName` (e.g. `'Y'`), and `buttonImageSrc`.

You can use the following mappings:
* Xbox 360
* Xbox One
* PS3
* PS4

### Properties

```javascript
GamepadIcons.buttonsPath
```

The root path to find button images in. Change this property if you wish to store button image assets somewhere other than as a sibling to `gamepad-icons.js`. Defaults to `/buttons`.

```javascript
GamepadIcons.mappings
```

A dictionary of all supported mappings.

# Gamepad Icon Credits

Gamepad button icon assets courtesy of [Nicolae Berbece "Xelu"](https://opengameart.org/content/free-keyboard-and-controllers-prompts-pack) and are released in the public domain under Creative Commons 0 (CC0).