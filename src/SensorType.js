import React, { Component } from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

import {
    JsonTree,
    ADD_DELTA_TYPE,
    REMOVE_DELTA_TYPE,
    UPDATE_DELTA_TYPE,
    DATA_TYPES,
    INPUT_USAGE_TYPES,
} from 'react-editable-json-tree'

import EditableText from './EditableText.js';
import Select from 'react-select';
import { handleFetch } from './errors.js';

export default class SensorType extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            name: '',
            typedef: '',
            isOpen: false,
            hasError: false,
            placeholder: {
                name: 'name',
                typedef: 'description'
            }
        }
    };
    componentDidMount(){
        this.setState({
            name: this.props.sensorType.name,
            typedef: this.props.sensorType.typedef
        });
    }
    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    componentDidUpdate(prevProps, prevState){
        if (this.props.sensorType !== prevProps.sensorType) {
            // Do smth when Props change
        }
    }
    edit(index){
        this.props.invokeEdit(index);
    }
    saveChanges(changes) {
        this.props.onEdit(changes);
    }
    del(){

    }
    put(updateData){
        console.log(JSON.stringify({name: this.state.name, typedef: this.state.typedef, ...updateData}));
        return fetch('/api/sensortype/'+this.props.sensorType.id,{
            method: 'PUT',
            body: JSON.stringify({name: this.state.name, typedef: this.state.typedef, ...updateData}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((result) => {
            return result.json();
        }).then((jsonResult) => {
            this.state.hasChanged = false;
            this.setState(updateData);
        }).catch(err => err);
    }

    /**
    * handles changes, sends a patch to change the existing data, set the state
    * @param {dict} state current data
    * @param {string} newDataKey attribute to be updated
    * @param {string} newDataValue new value of the attribute
    */
    handleChanges(newDataKey, newDataValue, ){
        var newData = {};
        newData[newDataKey] = newDataValue;
        this.put(newData)
            .then((result) => {
                this.setState({ result, hasChanged: true });
                }
            ).catch(handleFetch);
    }

    render(){
        return (
            <div className="card bg-light mb-3">
                <div className="card-header">
                    Sensor {this.state.name} with Type ID: {this.props.sensorType.id}
                    <button type="button" className="btn btn-danger float-right" style={{padding: "0px 5px"}} onClick={(ev) => this.props.deleteSensorType(this.props.sensorType.id) }>
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>
                <div className="card-body">
                    <EditableText
                        placeholder={this.state.placeholder.name}
                        label='name'
                        value={this.state.name}
                        status={this.state.status}
                        error={this.state.error && this.state.error.name ? this.state.error.name : undefined}
                        onChanges={(newValue) => this.handleChanges("name", newValue) }
                    />
                    <JsonTree
                        data={this.state.typedef}
                        onFullyUpdate={((newValue) => this.handleChanges("typedef", newValue))}
                        inputElement={<input className="form-control"/>}
                        addButtonElement={<button className="btn btn-outline-primary btn-block"> Add </button>}
                        editButtonElement={<button className="btn btn-outline-primary btn-block"> Edit </button>}
                        cancelButtonElement={<button className="btn btn-outline-secondary btn-block" style={{"margin-top": "20px"}}> Cancel </button>}
                    />

                </div>
            </div>
        );
    }
}
