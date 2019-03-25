import React, { Component } from 'react';
import Sensor from './Sensor.js'
import Select from 'react-select';
import { handleFetch } from './errors.js';

import Leaflet from 'leaflet'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import SensorListMapView from './SensorListMapView.js'

Leaflet.Icon.Default.imagePath = '/images/';


export default class SensorList extends React.Component{
    constructor(props) {
        super(props);
        const DEFAULT_VIEWPORT = {
            center: [0, 0],
            zoom: 1
        }
        this.state = {
            sensors: [],
            sensorTypes: [],
            newSensor: {
                name: "",
                note: "",
                id_sensor_type: null
            },
            initViewport: DEFAULT_VIEWPORT,
            initSet: false,
            viewport: DEFAULT_VIEWPORT,
            positions: [[32.581232,35.182696],[31.581232,34.182696],[22.581232,35.182696]],
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
        console.log("this.state.positions");
        console.log(this.state.positions);
    }
    onClickReset = () => {
        this.setState({ viewport: this.state.initViewport })
    }
    onViewportChanged = viewport => {
        if(!this.state.initSet){
            this.setState({ initSet: true,
                initViewport: viewport });
        }
        this.setState({ viewport })
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
            console.log(jsonResult);
            this.setState({
                    sensors: jsonResult
                }, () => {
                    this.setPositions();
                }
            );
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
            this.setState({ sensorTypes: jsonResult });
            console.log(jsonResult);
        })
    }
    setPositions(){
        let positions = []
        this.state.sensors.forEach(function(obj) {
            if(obj && obj.coordinatesjson != null && obj.coordinatesjson.coordinates){
                positions.push(obj.coordinatesjson.coordinates);

            }
        });
        if(positions.length > 1){
            this.setState({positions: positions});
        }
    }
    getPosition(sensor){
        if(sensor.coordinatesjson != null && sensor.coordinatesjson.coordinates){
            return sensor.coordinatesjson.coordinates;
        }
    }
    getTypdefBySensor(sensor){
        if(this.state.sensorTypes.filter(obj => {return obj.id === sensor.id_sensor_type}) && this.state.sensorTypes.filter(obj => {return obj.id === sensor.id_sensor_type})[0].typedef){
            return this.state.sensorTypes.filter(obj => {return obj.id === sensor.id_sensor_type})[0].typedef;
        }

    }
    render(){
        return (
        <div className="container" style={{width: '100%', 'marginRight': 0, 'maxWidth': '100%', padding: 0}}>
            <div className="row" style={{width: '100%', margin: 0}}>
                <div className="col" style={{'height': 'calc(100vh - 56px)', padding: 0, margin: 0, width: '100%'}}>
                    <Map
                        bounds={this.state.positions}
                        onClick={this.onClickReset}
                        onViewportChanged={this.onViewportChanged}
                        viewport={this.state.viewport}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        />
                        {this.state.sensors.map((sensor, index) =>
                            <div>
                                {sensor.coordinatesjson != null && sensor.coordinatesjson.coordinates &&
                                    <Marker position={this.getPosition(sensor)} key={index}>
                                        <Popup>
                                            <div>
                                                <h5>{sensor.name}</h5>
                                                <SensorListMapView
                                                    sensor={sensor}
                                                    index={index}
                                                    typedef={this.getTypdefBySensor(sensor)}
                                                />
                                            </div>
                                        </Popup>
                                    </Marker>
                                }
                            </div>
                        )}
                    </Map>
                </div>
            </div>
        </div>
        );
    }
}
