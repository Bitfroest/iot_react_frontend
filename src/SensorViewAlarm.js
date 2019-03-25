import React, { Component } from 'react';
import ReactDom from "react-dom";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import EditableText from "./EditableText.js"

import "react-big-calendar/lib/css/react-big-calendar.css";
import BigCalendar from 'react-big-calendar'
import 'moment/locale/en-gb';

moment.locale('en-gb', {week: {dow: moment().day()}});
BigCalendar.momentLocalizer(moment);
//BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export default class SensorViewAlarm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            newEvent: {
                name: "",
                wakeUpTime: null,
                startTime: null,
                endTime: null,
                location: "",
                weekday: null,
            },
            toggleEventEdit: false,
            weekdays: [
                {"label": "Monday", "value": "monday"},
                {"label": "Tuesday", "value": "tuesday"},
            ]
        };
    }

    componentDidUpdate(prevProps){
        if (this.props.lastValue !== prevProps.lastValue) {
            this.setState({events : this.props.lastValue});
        }
    }

    handleChanges(events){
        this.props.onChange(events);
    }

    update(index, updateKey, updateData){
        let events = this.state.events;
        events[index][updateKey] = updateData;
        this.handleChanges(events);
    }

    delete(index){
        let events = this.state.events.filter((el,i) => i !== index);
        this.handleChanges(events);
    }

    add(event){
        let events = this.state.events;
        events.push(event);
        this.handleChanges(events);
    }
    createEvents(data){
        let events = [];
        let id = 0;
        data.forEach(function(obj) {
            if(obj != null && 'name' in obj && 'wakeUpTime' in obj && 'startTime' in obj && 'endTime' in obj){
                let event = {};
                event.id = id;
                event.title = obj.name;
                event.start = moment(obj.startTime).toDate();
                event.end = moment(obj.endTime).toDate();
                events.push(event);
                let eventAlarm = {};
                id++;
                eventAlarm.id = id;
                eventAlarm.title = "Alarm";
                eventAlarm.start = moment(obj.wakeUpTime).toDate();
                eventAlarm.end = moment(obj.wakeUpTime).add(5, 'minutes').toDate();
                events.push(eventAlarm);
                id++;
            }
        });
        //console.log(events);
        return events;
    }

    render(){
        return (
            <div className="mb-3">
                <div>
                <BigCalendar
                    events={this.createEvents(this.state.events)}
                    defaultView={'week'}
                    views={['week', 'day', 'agenda']}
                    step={60}
                    showMultiDayTimes
                    defaultDate={new Date()}
                    />
                </div>
                <span className="badge badge-light toggle" value={this.state.toggleEventEdit} onClick={(event) => this.setState({toggleEventEdit: !this.state.toggleEventEdit}) }>
                    toggle edit mode
                </span>
                {this.props.typedef.label && <label for={'alarm_' + this.props.key}>{this.props.typedef.label}</label>}
                {this.state.toggleEventEdit &&
                <div className="events-list">{this.state.events.map((event, index) =>
                    <div className="container" key={index}>
                        {event != null && event.name &&
                            <div className="row">
                                <div className="col">
                                    <EditableText
                                        label="Name"
                                        id="new_name"
                                        placeholder="Neo Magazin Royal"
                                        value={event.name}
                                        onChanges={(value) => this.update(index, "name", value)}
                                    />
                                </div>
                            </div>
                        }
                        {event != null && event.weekday &&
                            <div className="row">
                                <div className="col">
                                    <label>Weekday</label>
                                    <Select
                                        value={event.weekday}
                                        onChange={(value) => this.update(index, "weekday", value)}
                                        options={this.state.weekdays}
                                    />
                                </div>
                            </div>
                        }
                        {event != null && event.wakeUpTime &&
                            <div className="row">
                                <div className="col">
                                    <label>Wake Up Time</label>
                                    <DatePicker
                                        selected={moment(event.wakeUpTime)}
                                        onChange={(value) => this.update(index, "wakeUpTime", value)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeFormat="HH:mm"
                                        dateFormat="LLL"
                                        timeCaption="Time"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        }
                        {event != null && event.startTime &&
                            <div className="row">
                                <div className="col">
                                    <label>Start Time</label>
                                    <DatePicker
                                        selected={moment(event.startTime)}
                                        onChange={(value) => this.update(index, "startTime", value)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeFormat="HH:mm"
                                        dateFormat="LLL"
                                        timeCaption="Time"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        }
                        {event != null && event.endTime &&
                            <div className="row">
                                <div className="col">
                                    <label>End Time</label>
                                    <DatePicker
                                        selected={moment(event.endTime)}
                                        onChange={(value) => this.update(index, "endTime", value)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeFormat="HH:mm"
                                        dateFormat="LLL"
                                        timeCaption="Time"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        }
                        {event != null && event.location &&
                            <div className="row">
                                <div className="col">
                                    <EditableText
                                        label="Location"
                                        id="new_location"
                                        placeholder="München"
                                        value={event.location}
                                        onChanges={(value) => this.update(index, "location", value)}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                )}
                </div>
                }
                {this.state.toggleEventEdit &&
                <div className="container">
                    {this.props.typedef.label && <label for={'alarm_' + this.props.key}>Add New {this.props.typedef.label}</label>}
                    <div className="row">
                        <div className="col">
                            <EditableText
                                label="Name"
                                id="new_name"
                                placeholder="Neo Magazin Royal"
                                value={this.state.newEvent.name}
                                onChanges={(value) => this.setState({ newEvent: {...this.state.newEvent, name: value} }) }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Weekday</label>
                            <Select
                                value={this.state.newEvent.weekday}
                                onChange={(value) => this.setState({ newEvent: {...this.state.newEvent, weekday: value} }) }
                                options={this.state.weekdays}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Wake Up Time</label>
                            <DatePicker
                                selected={this.state.newEvent.wakeUpTime}
                                onChange={(value) => this.setState({ newEvent: {...this.state.newEvent, wakeUpTime: value} }) }
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeFormat="HH:mm"
                                dateFormat="LT"
                                timeCaption="Time"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Start Time</label>
                            <DatePicker
                                selected={this.state.newEvent.startTime}
                                onChange={(value) => this.setState({ newEvent: {...this.state.newEvent, startTime: value} }) }
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeFormat="HH:mm"
                                dateFormat="LT"
                                timeCaption="Time"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>End Time</label>
                            <DatePicker
                                selected={this.state.newEvent.endTime}
                                onChange={(value) => this.setState({ newEvent: {...this.state.newEvent, endTime: value} }) }
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeFormat="HH:mm"
                                dateFormat="LT"
                                timeCaption="Time"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <EditableText
                                label="Location"
                                id="new_location"
                                placeholder="München"
                                value={this.state.newEvent.location}
                                onChanges={(value) => this.setState({ newEvent: {...this.state.newEvent, location: value} }) }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button className="btn btn-outline-success" onClick={() => this.add(this.state.newEvent)}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}
