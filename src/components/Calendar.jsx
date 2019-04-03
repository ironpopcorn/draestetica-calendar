import React, { Component } from 'react';
import './Calendar.scss';

class Calendar extends Component {

  constructor(prop) {
    super(prop);
    this.state = {
      days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      date: new Date(),
      initialWeekDay: 0,
      initialDay: 0,
      finalDay: 0,
    };
  }

  componentDidMount() {
    this.setState({
      initialWeekDay: this.state.date.getDay(),
      initialDay: this.state.date.getDate(),
      finalDay: this.daysInMonth(this.state.date.getMonth(), this.state.date.getFullYear()),
    });
  }

  renderDays() {
    return this.state.days.map(day => <div key={`weekday-${day}`} className="calendar-day">{this.capitalizeFirstLetter(day)}</div>)
  }

  renderDate() {
    let { initialWeekDay, initialDay, finalDay } = this.state;

    let calendar = [];

    for (let i = 0; i <= initialWeekDay; i++) {
      calendar.push(<div key={`blank-${i}`} className="calendar-day calendar-day-blank"> </div>);
    }

    for (let i = 1; i <= finalDay; i++) {
      if (i < initialDay) {
        calendar.push(<div key={`day-${i}`} className="calendar-day calendar-day-disabled">{i}</div>);
      } else {
        calendar.push(<div key={`day-${i}`} className="calendar-day calendar-day-available">{i}</div>);
      }
    }

    return calendar;
  }

  renderMonth() {
    return this.capitalizeFirstLetter(this.state.months[this.state.date.getMonth()]);
  }

  daysInMonth(month, year)
  {
    return 32 - new Date(year, month, 32).getDate();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {

    return (
      <div className="calendar">
        <div className="row text-center">
          <h2>{this.renderMonth()}</h2>
        </div>
        <div className="row">
          {this.renderDays()}
          {this.renderDate()}
        </div>
      </div>
    );
  }
}

export default Calendar;
