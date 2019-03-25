import React, { Component } from 'react';
import ReactDom from "react-dom";
import Select from 'react-select';

export default class SensorViewSelect extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
    }

    componentDidUpdate(prevProps){
        if (this.props.lastValue !== prevProps.lastValue) {
            this.setState({value : this.props.lastValue});
        }
    }

    handleChanges(value){
        this.props.onChange(value);
    }

    render(){
        return (
            <div className="mb-3">
                    {this.props.typedef.label && <label for={'Select_' + this.props.key}>{this.props.typedef.label}</label>}
                    <Select
                        value={this.state.value}
                        onChange={(value) => this.handleChanges(value)}
                        options={this.props.typedef.options}
                    />
            </div>
        );
    }
}
