import React, { PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'

export const Appointment = ({appointment}) =>
    <div className="appointment">
        <Link to={`/appointment/${appointment.id}`} >
            <h3>{appointment.title}</h3>
        </Link>
        <p>{formatDate(appointment.appt_time)}</p>
    </div>

Appointment.propTypes = {
    appointment: PropTypes.object.isRequired
}