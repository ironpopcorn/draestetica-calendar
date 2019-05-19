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
      showDate: false,
      selected: null,
    };
    this.nextMonth = this.nextMonth.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.saveAppointment = this.saveAppointment.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleHourClick = this.handleHourClick.bind(this);
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

    this.props.setDate(date, true);
    this.setState({ showDate: false });
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

      this.props.setDate(date, true);
      this.setState({ showDate: false });
    }
  }

  saveAppointment() {
    this.props.fetchSaveAppointment(this.state.selected);
  }

  handleDayClick(day) {
    const { date } = this.props;
    date.setDate(day);
    this.props.setDate(date);
    this.setState({ showDate: true, selected: null });
  }

  handleHourClick(selected) {
    this.setState({ selected });
  }

  static renderweekdays() {
    return days.map(day => <div key={`weekday-${day}`} className='calendar-day'>{Calendar.capitalizeFirstLetter(day)}</div>);
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
      calendar.push(<div key={`blank-${i}`} className='calendar-day calendar-day-blank'>{`${i}`}</div>);
    }

    for (let i = 1; i <= lastDay; i++) {
      calendar.push(this.renderCalendarDay(i, weekday));
      weekday = (weekday === 6) ? 0 : weekday + 1;
    }

    if (firstDayNextMonth !== 0) {
      for (let i = firstDayNextMonth; i <= 6; i++) {
        calendar.push(<div key={`blank-${i}`} className='calendar-day calendar-day-blank'>{`${day}`}</div>);
        day += 1;
      }
    }

    return (
      <section>
        <div className='row'>
          {Calendar.renderweekdays()}
          {calendar}
        </div>
        <div className='row'>
          {this.renderPreviousMonthButton()}
          {this.renderNextMonthButton()}
        </div>
      </section>
    );
  }

  renderCalendarDay(day, weekday) {
    const { showDate } = this.state;
    const { availableDays, date } = this.props;
    const calendar = [];

    let classes = 'calendar-day calendar-day-disabled';
    let click;

    if (today.getMonth() === this.props.date.getMonth()) {
      if (availableDays[weekday] === 1) {
        if (day === date.getDate() && showDate) {
          classes = 'calendar-day calendar-day-selected';
        } else if (day >= today.getDate()) {
          classes = 'calendar-day calendar-day-available';
          click = () => this.handleDayClick(day);
        }
      }
    } else if (availableDays[weekday] === 1) {
      if (day === date.getDate() && showDate) {
        classes = 'calendar-day calendar-day-selected';
      } else {
        classes = 'calendar-day calendar-day-available';
        click = () => this.handleDayClick(day);
      }
    }

    calendar.push(<div key={`day-${day}`} weekday={`weekday-${weekday}`} className={classes} onClick={click}>{day}</div>);
    return calendar;
  }

  renderDay() {
    const { showDate } = this.state;
    const { date } = this.props;
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    if (showDate) {
      return (
        <section className='view'>
          <h2>{ date.toLocaleDateString('es-ES', options) }</h2>
          {this.renderHours(date)}
          {this.state.selected
            && <button onClick={this.saveAppointment}>Agendar Cita</button>
          }
        </section>
      );
    }
    return null;
  }

  renderHours(date) {
    const { selected } = this.state;
    const { appointments } = this.props;
    let availableHours = [];

    for (let h = 0; h < 10; h++) {
      availableHours.push(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8 + h, 0, 0, 0),
      );
    }

    appointments.map((appointment) => {
      const datetime = new Date(appointment.dateTime * 1000);
      if (date.getMonth() === datetime.getMonth()
          && date.getDate() === datetime.getDate()) {
        availableHours = availableHours.filter(h => h.getHours() !== datetime.getHours());
      }
      return null;
    });

    return (
      <ul>
        {availableHours.map((hour, i) => (
          <li key={`hour-${i}`}>
            <button type='button'
              className={hour.getHours() === (selected && selected.getHours()) ? 'selected' : ''}
              onClick={() => this.handleHourClick(hour)}>
              {`${hour.getHours() < 10 ? '0' : ''}${hour.getHours()}:00`}
              &nbsp;-&nbsp;
              {`${hour.getHours() + 1 < 10 ? '0' : ''}${hour.getHours() + 1}:00`}
            </button>
          </li>
        ))}
      </ul>
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
      <div className='calendar'>
        <div className='row text-center'>
          <h2>{this.props.date.getFullYear()} {this.renderMonth()}</h2>
        </div>
        <div className='container'>
          <div className='container-left'>
            {this.renderCalendar()}
          </div>
          <div className='container-right'>
            {this.renderDay()}
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
  fetchSaveAppointment: PropTypes.func.isRequired,
  availableDays: PropTypes.array.isRequired,
  appointments: PropTypes.array,
};

export default Calendar;
