import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Confirmation.scss';

class Confirmation extends Component {
  render() {
    const { date } = this.props;
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    return (
      <div className='confirmation'>
        <div className='container'>
          <h1>Confirmación</h1>
          <p>Su cita ha sido {window.mode === 1 ? 're' : ''}agendada para el <strong>{date.toLocaleDateString('es-ES', options)}</strong></p>
        </div>
      </div>
    );
  }
}

Confirmation.propTypes = {
  date: PropTypes.object.isRequired,
};

export default Confirmation;
