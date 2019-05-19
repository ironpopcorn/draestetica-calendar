import React, { Component } from 'react';
import Calendar from './Calendar';
import Confirmation from './Confirmation';

const baseUrl = 'http://localhost:30000/calendar/';

const fetchApi = (url, body = {}, callback) => {
  fetch(`${baseUrl + url}`, {
    mode: 'cors',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then(response => response.json())
    .then(myJson => callback(myJson))
    .catch(error => console.error(error));
};

class Main extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      date: new Date(),
      availableDays: [0, 0, 0, 0, 0, 0, 0],
      userId: window.userId,
      serviceId: window.serviceId,
      mode: window.mode,
      appointments: null,
      saved: false,
    };
    this.setDate = this.setDate.bind(this);
  }

  componentDidMount() {
    this.fetchAvailableDays();
    this.fetchAppointmentsByMonth();
  }

  setDate(date, fetch = false) {
    this.setState({ date });
    if (fetch) {
      this.fetchAppointmentsByMonth();
    }
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
    const { date, serviceId } = this.state;
    const startDate = Calendar.dateToUnixTimestamp(date);
    const finalDate = Calendar.dateToUnixTimestamp(
      Calendar.finalDateInMonth(date.getMonth(), date.getFullYear()),
    );
    const body = JSON.stringify({
      serviceId,
      startDate,
      finalDate,
    });

    fetchApi('appointmentsbymonth', body, appointments => this.setState({ appointments }));
  }

  fetchSaveAppointment(date) {
    const { userId, serviceId, mode } = this.state;
    const dateTime = Calendar.dateToUnixTimestamp(date);
    const body = JSON.stringify({
      userId,
      serviceId,
      dateTime,
    });

    fetchApi(`saveappointment?mode=${mode}`, body, saved => this.setState({ date, saved }));
  }

  render() {
    const { date, saved } = this.state;

    if (saved) {
      return <Confirmation date={date} />;
    }

    return (
      <Calendar
        date={date}
        setDate={this.setDate}
        fetchSaveAppointment={datetime => this.fetchSaveAppointment(datetime)}
        availableDays={this.state.availableDays}
        appointments={this.state.appointments} />
    );
  }
}

export default Main;
