import React, { Component } from 'react';
import Calendar from './Calendar';

const baseUrl = 'http://localhost/draestetica.com/calendar/';

class Main extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      date: new Date(),
      availableDays: [0, 0, 0, 0, 0, 0, 0],
      userId: window.userId,
    };
    this.setDate = this.setDate.bind(this);
  }

  componentDidMount() {
    this.fetchAvailableDays();
  }

  setDate(date) {
    this.setState({ date });
  }

  setAvailableDays(availableDays) {
    this.setState({ availableDays });
  }

  fetchAvailableDays() {
    fetch(`${baseUrl}availabledays`, {
      mode: 'cors',
    })
      .then(response => response.json())
      .then(myJson => this.setAvailableDays(myJson))
      .catch(error => console.error(error));
  }

  fetchAppointmentsByMonth() {
    const { date } = this.state;
    const startDate = Calendar.dateToUnixTimestamp(date);
    const finalDate = Calendar.dateToUnixTimestamp(
      Calendar.finalDateInMonth(date.getMonth(), date.getFullYear()),
    );
    const body = JSON.stringify({
      startDate,
      finalDate,
    });

    this.fetchApi('appointmentsbymonth', body);
  }

  fetchSaveAppointment(date) {
    const userId = 1;
    const dateTime = Calendar.dateToUnixTimestamp(date);
    const body = JSON.stringify({
      userId,
      dateTime,
    });

    this.fetchApi('saveappointment', body);
  }

  fetchApi(url, body = {}) {
    fetch(`${baseUrl + url}`, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then(response => response.json())
      .then(myJson => console.log(myJson))
      .catch(error => console.error(error));
  }

  render() {
    return (
        <Calendar
          date={this.state.date}
          setDate={this.setDate}
          fetchSaveAppointment={this.fetchSaveAppointment}
          availableDays={this.state.availableDays} />
    );
  }
}

export default Main;
