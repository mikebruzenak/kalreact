import React from 'react'
import AppointmentForm from './AppointmentForm'
import { AppointmentsList } from './AppointmentsList'
import update from 'immutability-helper'
import { FormErrors } from './FormErrors'

export default class Appointments extends React.Component{
    constructor(props, _railsContext) {
        super(props)
        this.state = {
            appointments: this.props.appointments,
            title: '',
            appt_time: '',
            formErrors: {},
            formValid: false
        }
    }

    handleUserInput = (obj) => {
        this.setState(obj, this.validateForm)
    }

    validateForm() {
        this.setState({formValid: this.state.title.trim().length > 2})
    }

    handleFormSubmit = () => {
        const appointment = {title: this.state.title, appt_time: this.state.appt_time};
        $.post('/appointments', {appointment: appointment})
            .done((data) => {
                this.addNewAppointment(data)
                this.resetForm()
            })
            .fail((response) => {
                console.log(response)
                this.setState({formErrors: response.responseJSON})
            })
    }

    resetForm () {
        this.setState({formErrors: {}, title: '', appt_time: ''})
    }

    addNewAppointment(appointment) {
        const appointments = update(this.state.appointments, { $push: [appointment]});
        this.setState({
            appointments: appointments.sort(function(a,b){
                return new Date(a.appt_time) - new Date(b.appt_time);
            })
        })
    }

    render() {
        return (
            <div>
                <FormErrors formErrors = {this.state.formErrors} />
                <AppointmentForm title={this.state.title}
                                 appt_time={this.state.appt_time}
                                 formValid={this.state.formValid}
                                 onUserInput={this.handleUserInput}
                                 onFormSubmit={this.handleFormSubmit} />
                <AppointmentsList appointments={this.state.appointments} />
            </div>
        )
    }
}