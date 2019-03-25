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
import SensorType from './SensorType.js'

export default class SensorTypeList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            sensors: [],
            sensorTypes: [],
            newSensorType: {
                name: "",
                typedef: {}
            },
        };
    }
    componentDidMount(){
        this.getSensorTypes();
        this.getSensors();
    }
    componentDidUpdate(prevProps, prevState){
        if (this.props.id !== prevProps.id) {
            // Do smth when Props change
        }
    }
    createSelectOptions(data){
        data.forEach(function(obj) {
            obj.value = obj.id;
            obj.label = obj.area_name;
        });
        return data;
    }
    newSensorType() {
        this.post(this.state.sensorTypes, this.state.newSensorType)
            .then((result) => {
                this.setState({
                    sensorTypes: result,
                    newSensor: { // reset inputs
                        name: "",
                        typedef: ''
                    },
                });
            });
    }
    getSensors(){
        fetch('/api/sensors')
        .then((result) => {
            console.log(result);
            return result.json();
        }).then((jsonResult) => {
            this.setState({ sensors: jsonResult })
            console.log(jsonResult);
        })
    }
    getSensorTypes(){
        fetch('/api/sensortypes')
        .then((result) => {
            console.log(result);
            return result.json();
        }).then((jsonResult) => {
            jsonResult.forEach(function(obj) {
                obj.value = obj.id;
                obj.label = obj.name;
                //obj.typedef = JSON.stringify(obj.typedef);
            });
            this.setState({ sensorTypes: jsonResult })
            console.log(jsonResult);
        })
    }
    post(data, newData){
        if(newData === ""){
            return data;
        }
        //console.log(newData)
        //var j = JSON.parse(newData.typedef);
        //newData.typedef = j;
        return fetch('/api/sensortypes',{
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((result) => {
            return result.json();
        }).then((jsonResult) => {
            //var j = JSON.stringify(jsonResult.typedef);
            //jsonResult.typedef = j;
            data.push(jsonResult);
            return data;
        }).catch(err => err);
    }
    deleteSensorType(tableId){
        this.del(this.state.sensorTypes, tableId).then((result) => {this.setState({ sensorTypes: result })}).catch(handleFetch);
    }
    /**
    * Deletes the item with the table id form a table.
    * @param {dict} data
    * @param {integer} tableId the tableId to delete
    * @return {Promise} returns a Promise of the fetch (DELETE)
    */
    del(data, tableId){
        return fetch('/api/sensortype/'+tableId,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if(response.status >= 200 && response.status < 500) {
                var list = data.filter((el) => el.id !== tableId);
                return list;
            } else {
                return Promise.reject({
                    message: response.statusText
                });
            }
        });
    }
    render(){
        return (
        <div className="container">
            <div className="row mb-3">
            </div>
            <div className="sensor-list card-columns">{this.state.sensorTypes.map((sensorType, index) =>
                <SensorType
                    sensorType={sensorType}
                    index={index}
                    deleteSensorType={(id) => this.deleteSensorType(id)}
                />
            )}
                <div className="card bg-light mb-3">
                    <div className="card-header">
                        Create new Sensor Type
                    </div>
                    <div className="card-body">
                        <EditableText
                            placeholder='name'
                            label='name'
                            value={this.state.newSensorType.name}
                            status={this.state.status}
                            error={this.state.error && this.state.error.name ? this.state.error.name : undefined}
                            onChanges={(newValue) => this.setState({ newSensorType: {...this.state.newSensorType, name: newValue} }) }
                        />
                        <JsonTree
                            data={this.state.newSensorType.typedef}
                            onFullyUpdate={(newValue) => this.setState({ newSensorType: {...this.state.newSensorType, typedef: newValue} }) }
                            inputElement={<input className="form-control"/>}
                            addButtonElement={<button className="btn btn-outline-primary btn-block"> Add </button>}
                            editButtonElement={<button className="btn btn-outline-primary btn-block"> Edit </button>}
                            cancelButtonElement={<button className="btn btn-outline-secondary btn-block" style={{"margin-top": "20px"}}> Cancel </button>}
                        />
                        <div className="col-2">
                            <button className="btn btn-outline-success" onClick={() => this.newSensorType()}>
                                Add Sensor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
