import React, { Component } from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

import EditableText from './EditableText.js';
import SensorMap from './SensorMap.js';
import Select from 'react-select';
import { handleFetch } from './errors.js';

export default class Sensor extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            name: '',
            note: '',
            coordsN:  0,
            coordsE: 0,
            height: 0,
            zoom: 5,
            id_sensor_type: 0,
            isOpen: false,
            hasError: false,
            placeholder: {
                name: 'sensor name',
                note: 'description',
                id_sensor_type: 'type'
            }
        }
    };
    componentDidMount(){
        this.setState({
            name: this.props.sensor.name,
            note: this.props.sensor.note,
            id_sensor_type: this.props.sensor.id_sensor_type
        });
        if(this.props.sensor.coordinatesjson !== undefined && this.props.sensor.coordinatesjson !== null && this.props.sensor.coordinatesjson.coordinates !== undefined && this.props.sensor.coordinatesjson.coordinates !== null && this.props.sensor.coordinatesjson.coordinates.length > 1){
            this.setState({ coordsN: this.props.sensor.coordinatesjson.coordinates[0], coordsE: this.props.sensor.coordinatesjson.coordinates[1], zoom: 15 });
        }else{
            this.setState({ coordsN: 0, coordsE: 0, zoom: 3});
        }

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
        if (this.props.sensor !== prevProps.sensor) {
            // Do smth when Props change
        }
    }
    edit(index){
        this.props.invokeEdit(index);
    }
    saveChanges(changes) {
        this.props.onEdit(changes);
    }
    put(updateData){
        return fetch('/api/sensor/'+this.props.sensor.id,{
            method: 'PUT',
            body: JSON.stringify({name: this.state.name, note: this.state.note, id_sensor_type: this.state.id_sensor_type, coordinates: [this.state.coordsN, this.state.coordsE], ...updateData}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((result) => {
            return result.json();
        }).then((jsonResult) => {
            this.state.hasChanged = false;
            this.setState(updateData);
        }).catch(handleFetch);
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
    updateCoordinates(north,east){
        this.setState({coordsN: north, coordsE: east});
        let coordinates = [north, east];
        this.setState({data : {...this.state.data, coordinates: {coordinates: coordinates, type: "Point"} }}, () => {
            this.handleChanges("coordinates", coordinates);
        });
    }

    render(){
        return (
            <div className="container">
                <div className="row mb-3">
                    <div className="col-2 col-xl-2 col-lg-2 col-md-2 mb-2">
                        <button type="button" className="btn btn-danger" onClick={(ev) => this.props.deleteSensor(this.props.sensor.id) }>
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>
                    </div>
                    <div className="col-10 col-xl-4 col-lg-4 col-md-10">
                        <EditableText
                            placeholder={this.state.placeholder.name}
                            label='name'
                            append={this.props.sensor.id}
                            value={this.state.name}
                            status={this.state.status}
                            error={this.state.error && this.state.error.name ? this.state.error.name : undefined}
                            onChanges={(newValue) => this.handleChanges("name", newValue) }
                        />
                    </div>
                    <div className="col-12 col-xl-3 col-lg-3 col-md-12">
                        <EditableText
                            placeholder={this.state.placeholder.notes}
                            value={this.state.note}
                            status={this.state.status}
                            error={this.state.error && this.state.error.note ? this.state.error.note : undefined}
                            onChanges={(newValue) => this.handleChanges("note", newValue) }
                        />
                    </div>
                    <div className="col-12 col-xl-3 col-lg-3 col-md-12">
                        <Select
                            name="id_sensor_type"
                            value={this.state.id_sensor_type}
                            onChange={(newValue) => this.put({id_sensor_type: newValue === null ? null : newValue.value}).then((result) => {this.setState({ result })}).catch(handleFetch) }
                            options={this.props.sensorTypes}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <h2 className="col details-label">Coordinates</h2>
                </div>
                <div className="row mb-3">
                    <div className="col-12 col-xl-6 col-lg-12 col-md-12">
                        <EditableText
                            label='North'
                            id={'sensor_n_' + this.props.id}
                            placeholder={this.state.placeholder.coordsN}
                            value={this.state.coordsN}
                            onChanges={(newValue) => this.updateCoordinates(parseFloat(newValue),this.state.coordsE,this.state.height) }
                        />
                    </div>
                    <div className="col-12 col-xl-6 col-lg-12 col-md-12">
                        <EditableText
                            label='East'
                            id={'sensor_e_' + this.props.id}
                            placeholder={this.state.placeholder.coordsE}
                            value={this.state.coordsE}
                            onChanges={(newValue) => this.updateCoordinates(this.state.coordsN,parseFloat(newValue),this.state.height) }
                        />
                    </div>
                </div>
                <div className="row sensor-map">
                    <SensorMap viewport={{center: [this.state.coordsN,this.state.coordsE], zoom: this.state.zoom}} positions={[[this.state.coordsN,this.state.coordsE]]}/>
                </div>
            </div>
        );
    }
}
