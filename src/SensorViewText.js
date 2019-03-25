import React, { Component } from 'react';
import ReactDom from "react-dom"
import EditableText from "./EditableText.js"

export default class SensorViewText extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    componentDidUpdate(prevProps){
        if (this.props.lastValue !== prevProps.lastValue) {
            this.setState({value : this.props.lastValue});
        }
    }

    handleChanges(newValue){
        this.props.onChange(newValue);
    }

    render(){
        return (
            <div className="">
                <div className="row mb-3">
                    <div className="col">
                        <EditableText
                            label={this.props.typedef.label}
                            id={this.props.typedef.label + '_' + this.props.key}
                            placeholder={this.props.typedef.placeholder}
                            inputType={this.props.typedef.inputType}
                            value={this.state.value}
                            status={this.state.status}
                            error={this.state.error && this.state.error.note ? this.state.error.note : undefined}
                            onChanges={(newValue) => this.handleChanges(newValue) }
                        />
                    </div>
                </div>
            </div>
        );
    }
}
