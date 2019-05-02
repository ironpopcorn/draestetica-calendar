import React, { Component } from 'react';
import Calendar from './Calendar';

class Main extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      date: new Date(),
      availableDays: [0, 0, 0, 0, 0, 0, 0],
    };
    this.setDate = this.setDate.bind(this);
  }

  componentDidMount() {
    this.fetchTest();
  }

  setDate(date) {
    this.setState({ date });
  }

  setAvailableDays(availableDays) {
    this.setState({ availableDays });
  }

  fetchTest() {
    fetch('http://localhost/draestetica.com/calendar/availabledays', {
      mode: 'cors',
    })
      .then(response => response.json())
      .then(myJson => this.setAvailableDays(myJson));
  }

  render() {
    return (
        <Calendar
          date={this.state.date}
          setDate={this.setDate}
          availableDays={this.state.availableDays} />
    );
  }
}

export default Main;
