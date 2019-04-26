import React, { Component } from 'react';
import Calendar from './Calendar';

class Main extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      date: new Date(),
    };
    this.setDate = this.setDate.bind(this);
  }

  setDate(date) {
    Main.fetchTest();
    this.setState({ date });
  }

  static fetchTest() {
    fetch('http://localhost/draestetica.com/calendar/test', {
      mode: 'cors', // no-cors, cors, *same-origin
    })
      .then((response) => { console.log(response) });
      // .then((response) => { response.json(); });
      // .then(myJson => console.log(JSON.stringify(myJson)))
      // .catch(error => console.error(error));
  }

  render() {
    return (
        <Calendar date={this.state.date} setDate={this.setDate} />
    );
  }
}

export default Main;
