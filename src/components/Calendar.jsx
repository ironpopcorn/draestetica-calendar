import React, { Component } from 'react';
import './Calendar.scss';

class Calendar extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      date: new Date(),
      today: new Date(),
    };
    this.nextMonth = this.nextMonth.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
  }

  nextMonth() {
    const { date } = this.state;

    if (date.getMonth() === 11) {
      date.setMonth(0);
      date.setYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    this.setState({ date });
  }

  previousMonth() {
    const { date, today } = this.state;

    if (date.getMonth() !== today.getMonth() && date.getFullYear() >= today.getFullYear()) {
      if (date.getMonth() === 0) {
        date.setMonth(11);
        date.setYear(date.getFullYear() - 1);
      } else {
        date.setMonth(date.getMonth() - 1);
      }
      this.setState({ date });
    }
  }

  renderWeekDays() {
    return this.state.days.map(day => <div key={`weekday-${day}`} className="calendar-day">{Calendar.capitalizeFirstLetter(day)}</div>);
  }

  renderDate() {
    const { date } = this.state;
    const firstWeekDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const firstDay = date.getDate();
    const lastDay = Calendar.daysInMonth(date.getMonth(), date.getFullYear());
    const lastDayPreviousMonth = Calendar.daysInMonth(date.getMonth() - 1, date.getFullYear());
    const calendar = [];

    let day = 1;

    for (let i = lastDayPreviousMonth - firstWeekDay + 1; i <= lastDayPreviousMonth; i++) {
      calendar.push(<div key={`blank-${i}`} className="calendar-day calendar-day-blank">{`${i}`}</div>);
    }

    for (let i = 1; i <= lastDay; i++) {
      if (date.getTime() < Date.now() && i < firstDay) {
        calendar.push(<div key={`day-${i}`} className="calendar-day calendar-day-disabled">{i}</div>);
      } else {
        calendar.push(<div key={`day-${i}`} className="calendar-day calendar-day-available">{i}</div>);
      }
    }

    for (let i = new Date(date.getFullYear(), date.getMonth() + 1).getDay(); i <= 6; i++) {
      calendar.push(<div key={`blank-${i}`} className="calendar-day calendar-day-blank">{`${day}`}</div>);
      day += 1;
    }

    return calendar;
  }

  renderMonth() {
    return Calendar.capitalizeFirstLetter(this.state.months[this.state.date.getMonth()]);
  }

  renderNextMonthButton() {
    return <button onClick={this.nextMonth}>Next Month</button>;
  }

  renderPreviousMonthButton() {
    return <button onClick={this.previousMonth}>Previous Month</button>;
  }

  static daysInMonth(month, year) {
    return 32 - new Date(year, month, 32).getDate();
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <div className="calendar">
        <div className="row text-center">
          <h2>{this.state.date.getFullYear()} {this.renderMonth()}</h2>
        </div>
        <div className="row">
          {this.renderWeekDays()}
          {this.renderDate()}
        </div>
        <div className="row">
          {this.renderPreviousMonthButton()}
          {this.renderNextMonthButton()}
        </div>
      </div>
    );
  }
}

export default Calendar;
