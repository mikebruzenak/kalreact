import React, { PropTypes } from 'react'
import Label from './label'
import Datetime from 'react-datetime'
import moment from 'moment'
import { validations } from '../utils/validations'
import { FormErrors } from './FormErrors'
import update from 'immutability-helper'


export default class AppointmentForm extends React.Component{
    static propTypes = {
        handleNewAppointment: PropTypes.func
    }

    constructor(props, _railsContext) {
        super(props)
        this.state = {
            title: {value: '', valid: false },
            appt_time: {value: '', valid: false },
            formErrors: {},
            formValid: false,
            editing: false
        }
        console.log(props)
    }

    //TODO set editing
    componentDidMount() {
        if (this.props.match) {
            $.ajax({
                type: 'GET',
                url: `/appointments/${this.props.match.params.id}`,
                dataType: 'JSON'
            }).done((data) => {
                this.setState({
                    title: {value:data.title, validations: true},
                    appt_time: {value:data.appt_time, valid: true},
                    editing: this.isEditing()
                })
            })
        }
    }

    static formValidations = {
        title: [ (s) => {return (validations.checkMinLength(s, 3))} ],
        appt_time: [(t) => { return(validations.timeShouldBeInTheFuture(t) ) }]
    }

    focus = () => {
        this.titleInput.focus()
    }

    // https://facebook.github.io/react/docs/update.html
    handleUserInput = (fieldName, fieldValue, validations) => {
        const newFieldState = update(this.state[fieldName], {value: {$set: fieldValue}})
        this.setState({[fieldName]: newFieldState}, () => {this.validateField(fieldName, fieldValue, validations)} )
    }

    validateField(fieldName, fieldValue, validations) {
        let fieldValid
        let fieldErrors = validations.reduce((errors,v) => {
            let e = v(fieldValue)
            if (e !== '') {
                errors.push(e)
            }
            return(errors)
        }, [])

        fieldValid = fieldErrors.length === 0

        const newFieldState = update(this.state[fieldName], {valid: {$set: fieldValid}})
        const newFormErrors = update( this.state.formErrors, {$merge: {[fieldName]: fieldErrors}})
        this.setState({[fieldName]: newFieldState, formErrors: newFormErrors}, this.validateForm)
    }

    validateForm() {
        this.setState({formValid: this.state.title.valid &&
        this.state.appt_time.valid
        })
    }

    isEditing = () => {
        if( this.props.match !== undefined && this.props.match.path === '/appointments/:id/edit') {
            return(true)
        } else {
            return(false)
        }
    }

    handleFormSubmit = (e) => {
        e.preventDefault()
        if( this.props.match !== undefined && this.props.match.path === '/appointments/:id/edit') {
            this.updateAppointment()
        } else {
            this.addAppointment()
        }
    }

    addAppointment = () => {
        const appointment = {title: this.state.title.value, appt_time: this.state.appt_time.value};
        $.post('/appointments', {appointment: appointment})
            .done((data) => {
            console.log('Added!')
                this.props.handleNewAppointment(data)
                this.resetForm()
            })
            .fail((response) => {
                console.log(response)
                this.setState({formErrors: response.responseJSON,
                    formValid: false})
            })
    }

    updateAppointment = () => {
        const appointment = {title: this.state.title.value, appt_time: this.state.appt_time.value};
        $.ajax({
            type: 'PATCH',
            url: `/appointments/${this.props.match.params.id}`,
            data: {appointment: appointment}
        })
            .done((data) => {
            console.log('Updated!')
                this.resetFormErrors()
            })
            .fail((response) => {
                console.log(response)
                this.setState({formErrors: response.responseJSON,
                    formValid: false})
            })
    }

    deleteAppointment = () => {
        $.ajax({
            type: 'DELETE',
            url: `/appointments/${this.props.match.params.id}`,
        })
            .done((data) => {
                console.log('Appointment deleted!')
                this.props.history.push('/')
                this.resetFormErrors()
            })
            .fail((response) => {
                console.log('deleting failed')
            })
    }

    resetFormErrors () {
        this.setState({formErrors: {}})
    }

    resetForm () {
        this.setState({formErrors: {}, title: {value: '', valid: false }, appt_time: {value: '', valid: false }})
    }

    handleChange = (e) => {
        // const fieldName = this.titleInput.name
        const fieldName = e.target.name
        const fieldValue = e.target.value
        this.handleUserInput( fieldName, fieldValue, AppointmentForm.formValidations[fieldName] )
    }

    setApptTime = (e) => {
        const fieldName = 'appt_time'
        const fieldValue = e.toDate()
        this.handleUserInput(fieldName, fieldValue, AppointmentForm.formValidations[fieldName])
    }

    render() {
        const inputProps = {
          name: 'appt_time'
        };
        console.log('RENDER OF FORM')
        console.log(this.state.formErrors)
        return(
            <div>
                <h2>
                    {this.state.editing ?
                    "Editing" :
                    "Make an appointment"}
                </h2>
                <FormErrors formErrors = {this.state.formErrors} />
                <Label label="Enter a title, date and time" />
                <form onSubmit={this.handleFormSubmit}>
                    <input name="title" placeholder="Appointment Title"
                           ref={(input) => {this.titleInput = input}}
                           value={this.state.title.value}
                           onChange={this.handleChange}/>

                    <input
                        type="button"
                        value="Focus the text input"
                        onClick={this.focus} />

                    <Datetime input={false}
                              open={true}
                              inputProps={inputProps}
                              value={moment(this.state.appt_time.value)}
                              onChange={this.setApptTime}/>

                    <input type="submit"
                           value={this.state.editing ? "Update Appointment" : "Make Appointment"}
                           className="submit-button"
                            disabled={!this.state.formValid}/>
                </form>
                {this.state.editing && (
                    <p>
                        <button onClick={this.deleteAppointment}>
                            Delete appointment
                        </button>
                    </p>
                )}
            </div>
        )
    }
}