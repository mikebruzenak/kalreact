import React from 'react'
import Label from './label'
import Datetime from 'react-datetime'

export default class AppointmentForm extends React.Component{
    handleChange(e) {
        const name = e.target.name;
        const obj = {};
        obj[name] = e.target.value;
        this.props.onUserInput(obj);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onFormSubmit();
    }

    setApptTime(e) {
        const name = 'appt_time';
        const obj = {};
        if (obj[name] = e.toDate()) {
            this.props.onUserInput(obj);
        }
    }

    render() {
        const inputProps = {
          name: 'appt_time'
        };

        return(
            <div>
                <h2>Make async New Appointment</h2>
                <Label label="Enter a title, date and time" />
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <input name="title" placeholder="Appointment Title"
                           value={this.props.title}
                           onChange={(event) => this.handleChange(event)}/>
                    <Datetime input={false}
                              open={true}
                              inputProps={inputProps}
                              value={this.props.appt_time}
                              onChange={(event) => this.setApptTime(event)}/>
                    <input type="submit" value="Make Appointment" className="submit-button"/>
                </form>
            </div>
        )
    }
}