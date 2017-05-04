import React from 'react'
import AppointmentForm from './AppointmentForm'
import { AppointmentsList } from './AppointmentsList'
import update from 'immutability-helper'
import { FormErrors } from './FormErrors'
import moment from 'moment'

export default class Appointments extends React.Component{
    constructor(props, _railsContext) {
        super(props)
        this.state = {
            appointments: this.props.appointments,
            title: {value: '', valid: false },
            appt_time: {value: '', valid: false },
            formErrors: {},
            formValid: false
        }
    }

    // https://facebook.github.io/react/docs/update.html
    handleUserInput = (fieldName, fieldValue) => {
        const newFieldState = update(this.state[fieldName], {value: {$set: fieldValue}})
        this.setState({[fieldName]: newFieldState}, () => {this.validateField(fieldName, fieldValue)} )
    }

    validateField(fieldName, fieldValue) {
        let fieldValid
        switch (fieldName) {
            case 'title':
                fieldValid = this.state.title.value.trim().length > 2
                break
            case 'appt_time':
                fieldValid = moment(this.state.appt_time.value).isValid() &&
                             moment(this.state.appt_time.value).isAfter()
                break
            default:
              break
        }
        const newFieldState = update(this.state[fieldName], {valid: {$set: fieldValid}})
        this.setState({[fieldName]: newFieldState}, this.validateForm)
    }

    validateForm() {
        this.setState({formValid: this.state.title.valid &&
                                  this.state.appt_time.valid
        })
    }

    handleFormSubmit = () => {
        const appointment = {title: this.state.title.value, appt_time: this.state.appt_time.value};
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