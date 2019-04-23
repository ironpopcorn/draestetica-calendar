import React, { Component } from 'react';
import Calendar from './Calendar';

class Main extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      date: new Date(),
    };
  }

  render() {
    return (
        <Calendar date={this.state.date} />
    );
  }
}

export default Main;
