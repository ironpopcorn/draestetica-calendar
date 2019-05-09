import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Calendar.scss';

const today = new Date();
const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

class Calendar extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      showDay: false,
    };
    this.nextMonth = this.nextMonth.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.backButton = this.backButton.bind(this);
    this.handleWeekdayChange = this.handleWeekdayChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  nextMonth() {
    const { date } = this.props;

    if (date.getMonth() === 11) {
      date.setMonth(0);
      date.setYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
      date.setDate(today.getDate());
    } else {
      date.setDate(1);
    }

    this.props.setDate(date);
  }

  previousMonth() {
    const { date } = this.props;

    if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
      if (date.getMonth() === 0) {
        date.setMonth(11);
        date.setYear(date.getFullYear() - 1);
      } else {
        date.setMonth(date.getMonth() - 1);
      }

      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        date.setDate(today.getDate());
      } else {
        date.setDate(1);
      }

      this.props.setDate(date);
    }
  }

  backButton() {
    this.setState({ showDay: false });
  }

  handleWeekdayChange(e) {
    const { availableDays } = this.props;
    const day = Calendar.getKeyByValue(days, e.target.name);

    availableDays[day] = (parseInt(e.target.value, 0) === 0) ? 1 : 0;
    this.setState({ availableDays });
  }

  handleDayClick(day) {
    const { date } = this.props;

    date.setDate(day);
    this.props.setDate(date);
    this.setState({ showDay: true });
  }

  static renderweekdays() {
    return days.map(day => <div key={`weekday-${day}`} className="calendar-day">{Calendar.capitalizeFirstLetter(day)}</div>);
  }

  renderCalendar() {
    const { date } = this.props;
    const firstweekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDay = Calendar.daysInMonth(date.getMonth(), date.getFullYear());
    const lastDayPreviousMonth = Calendar.daysInMonth(date.getMonth() - 1, date.getFullYear());
    const firstDayNextMonth = new Date(date.getFullYear(), date.getMonth() + 1).getDay();
    const calendar = [];

    let day = 1;
    let weekday = firstweekday;

    for (let i = lastDayPreviousMonth - firstweekday + 1; i <= lastDayPreviousMonth; i++) {
      calendar.push(<div key={`blank-${i}`} className="calendar-day calendar-day-blank">{`${i}`}</div>);
    }

    for (let i = 1; i <= lastDay; i++) {
      calendar.push(this.renderCalendarDay(i, weekday));
      weekday = (weekday === 6) ? 0 : weekday + 1;
    }

    if (firstDayNextMonth !== 0) {
      for (let i = firstDayNextMonth; i <= 6; i++) {
        calendar.push(<div key={`blank-${i}`} className="calendar-day calendar-day-blank">{`${day}`}</div>);
        day += 1;
      }
    }

    return (
      <section>
        <div className="row">
          {Calendar.renderweekdays()}
          {calendar}
        </div>
        <div className="row">
          {this.renderPreviousMonthButton()}
          {this.renderNextMonthButton()}
        </div>
      </section>
    );
  }

  renderCalendarDay(day, weekday) {
    const { availableDays } = this.props;
    const calendar = [];

    let classes;

    if (today.getMonth() === this.props.date.getMonth()) {
      classes = (day >= today.getDate() && availableDays[weekday] === 1)
        ? 'calendar-day calendar-day-available'
        : 'calendar-day calendar-day-disabled';
    } else {
      classes = (availableDays[weekday] === 1)
        ? 'calendar-day calendar-day-available'
        : 'calendar-day calendar-day-disabled';
    }

    calendar.push(<div key={`day-${day}`} weekday={`weekday-${weekday}`} className={classes} onClick={() => this.handleDayClick(day)}>{day}</div>);
    return calendar;
  }

  renderDay() {
    const { date } = this.props;
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return (
      <section>
        <h2>{ date.toLocaleDateString('es-ES', options) }</h2>
        <button onClick={this.backButton}>Volver</button>
      </section>
    );
  }

  renderMonth() {
    return Calendar.capitalizeFirstLetter(months[this.props.date.getMonth()]);
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

  static finalDateInMonth(month, year) {
    return new Date(
      year,
      month,
      Calendar.daysInMonth(month, year),
    );
  }

  static dateToUnixTimestamp(date) {
    return parseInt((date.getTime() / 1000).toFixed(0), 0);
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  render() {
    return (
      <div className="calendar">
        <div className="row text-center">
          <h2>{this.props.date.getFullYear()} {this.renderMonth()}</h2>
        </div>
        { (this.state.showDay === true)
          ? this.renderDay()
          : this.renderCalendar() }
      </div>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
  availableDays: PropTypes.array.isRequired,
};

export default Calendar;
