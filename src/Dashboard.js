import React, { Component } from 'react';
import SensorView from './SensorView.js'

export default class Dashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            sensors: [],
            sensorTypes: [],
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
    render(){
        return (
        <div className="container">
            <div className="row mb-3">
            </div>
            <div className="sensor-list">{this.state.sensors.map((sensor, index) =>
                <div className="row sensor" key={index}>
                    <div className="col">
                        {this.state.sensorTypes.filter(obj => {return obj.id === sensor.id_sensor_type}).map((sensorType, jdex) =>
                            <SensorView
                                sensor={sensor}
                                index={index}
                                typedef={sensorType.typedef}
                            />
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
        );
    }
}
