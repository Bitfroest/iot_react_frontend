import React, { Component } from 'react';
import ReactDom from "react-dom";
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class SensorViewText extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            value: moment()
        };
    }

    componentDidUpdate(prevProps){
        if (this.props.lastValue !== prevProps.lastValue) {
            this.setState({value : moment(this.props.lastValue)});
        }
    }

    handleChanges(value){
        this.props.onChange(value);
    }

    render(){
        return (
            <div className="mb-3">
                    {this.props.typedef.label && <label for={'DatePicker_' + this.props.key}>{this.props.typedef.label}</label>}
                    <DatePicker
                        selected={this.state.value}
                        onChange={(value) => this.handleChanges(value)}
                        showTimeSelect={this.props.typedef.showTimeSelect}
                        showTimeSelectOnly={this.props.typedef.showTimeSelectOnly}
                        timeIntervals={this.props.typedef.timeIntervals}
                        dateFormat={this.props.typedef.dateFormat}
                        timeFormat={this.props.typedef.timeFormat}
                        timeCaption="Time"
                        className="form-control"
                    />
            </div>
        );
    }
}
