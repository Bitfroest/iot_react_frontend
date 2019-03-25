import React, { Component } from 'react';
import Sensor from './Sensor.js'
import Select from 'react-select';
import { handleFetch } from './errors.js';

export default class SensorList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            sensors: [],
            sensorTypes: [],
            newSensor: {
                name: "",
                note: "",
                id_sensor_type: null
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
    newSensor() {
        this.post(this.state.sensors, this.state.newSensor)
            .then((result) => {
                this.setState({
                    sensors: result.data,
                    error: result.error,
                    newSensor: { // reset inputs
                        name: "",
                        note: "",
                        id_sensor_type: null
                    },
                });
            }).catch(handleFetch);
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
            });
            this.setState({ sensorTypes: jsonResult })
            console.log(jsonResult);
        })
    }
    /**
    * Insert a new item into a table.
    * @param {dict} data the new data to insert
    * @param {dict} newData the updated data
    * @return {Promise} returns a Promise of the fetch (POST)
    */
    post(data, newData){
        if(newData === ""){
            return data;
        }
        return fetch('/api/sensors',{
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if(response.status >= 200 && response.status < 500) {
                // Either successful request or invalid data
                return response.json().then((data) => ({
                    data: data,
                    ok: response.ok,
                }));
            } else {
                // Internal Server Error
                return Promise.reject({
                    message: response.statusText,
                });
            }
        }).then((result) => {
            if(result.ok) {
                data.push(result.data);
                return {data, error: null};
            } else {
                handleFetch(result.data.error);
                return {data, error: result.data.error};
            }
        });
    }
    deleteSensor(tableId){
        this.del(this.state.sensors, tableId).then((result) => {this.setState({ sensors: result })}).catch(handleFetch);
    }
    /**
    * Deletes the item with the table id form a table.
    * @param {dict} data
    * @param {integer} tableId the tableId to delete
    * @return {Promise} returns a Promise of the fetch (DELETE)
    */
    del(data, tableId){
        return fetch('/api/sensor/'+tableId,{
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
            <div className="sensor-list">{this.state.sensors.map((sensor, index) =>
                <div className="row sensor" key={index}>
                    <div className="col">
                        <Sensor
                            sensor={sensor}
                            index={index}
                            sensorTypes={this.state.sensorTypes}
                            deleteSensor={(id) => this.deleteSensor(id)}
                        />
                    </div>
                </div>
            )}
                <div className="row mb-3">
                    <div className="col">
                        <input className="form-control mr-sm-2" type="text" placeholder="Name" name="sensorName" value={this.state.newSensor.name} onChange={(event) => this.setState({ newSensor: {...this.state.newSensor, name: event.target.value} }) }/>
                    </div>
                    <div className="col">
                        <input className="form-control mr-sm-2" type="text" placeholder="Note" name="sensorNote" value={this.state.newSensor.note} onChange={(event) => this.setState({ newSensor: {...this.state.newSensor, note: event.target.value} }) }/>
                    </div>
                    <div className="col">
                        <Select
                            name="id_sensor_type"
                            value={this.state.newSensor.id_sensor_type}
                            onChange={(event) => this.setState({ newSensor: {...this.state.newSensor, id_sensor_type: event && event.value} }) }
                            options={this.state.sensorTypes}
                        />
                    </div>
                    <div className="col-2">
                        <button className="btn btn-outline-success" onClick={() => this.newSensor()}>
                            Add Sensor
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
