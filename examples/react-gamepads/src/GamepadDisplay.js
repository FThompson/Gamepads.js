import React from 'react';
import Gamepads from 'gamepads';
import GamepadIcons from 'gamepad-icons';

export default class GamepadDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapping: props.mapping,
      count: 0,
      pressed: []
    };
  }

  componentWillMount() {
    Gamepads.start();
    Gamepads.addEventListener('connect', e => {
      let gamepad = e.gamepad;
      gamepad.addEventListener('buttonpress', e => {
        this.setState(state => ({ pressed: [...state.pressed, e.index] }));
      });
      gamepad.addEventListener('buttonrelease', e => {
        this.setState(state => ({ pressed: state.pressed.filter(i => i !== e.index )}));
      });
      this.setState(state => ({ count: state.count + 1 }));
    });
    Gamepads.addEventListener('disconnect', e => {
      this.setState(state => ({ count: state.count - 1 }));
    });
  }

  render() {
    let buttons = this.state.pressed.map(i => {
      let button = GamepadIcons.getButton(this.state.mapping, i);
      return (
        <img key={i} src={button.buttonImageSrc} alt={button.buttonName} />
      );
    });
    return (
      <main>
        <p>Gamepads connected: {this.state.count}</p>
        <div>{buttons}</div>
      </main>
    );
  }
}