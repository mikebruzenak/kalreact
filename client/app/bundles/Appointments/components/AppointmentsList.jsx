import React from 'react'
import {Appointment} from './Appointment'

// can't make a const a default export
// import { AppointmentsList } from './appointments_list'

export const AppointmentsList = ({appointments}) =>
    <div>
        {appointments.map( function(appointment) {
            return (
                <Appointment appointment={appointment} key={appointment.id} />
            )
        })}
    </div>
