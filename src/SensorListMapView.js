import React, { Component } from 'react';
import ValuePlot from './ValuePlot.js'
import Battery from './Battery.js'
import Boolean from './Boolean.js'
import Wastebin from './Wastebin.js'
import SensorViewText from './SensorViewText.js'
import SensorViewDateTimePicker from './SensorViewDateTimePicker.js'
import SensorViewSelect from './SensorViewSelect.js'
import SensorViewAlarm from './SensorViewAlarm.js'


export default class SensorView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            name: '',
            isOpen: false,
            hasError: false,
            value: 0,
            ws: undefined
        }
    };
    componentDidMount(){
        this.setState({
            name: this.props.sensor.name,
            note: this.props.sensor.note,
            id_sensor_type: this.props.sensor.id_sensor_type
        });
        var host = window.location.host;
        this.state.ws = new WebSocket('ws://'+window.location.hostname+':8888/ws/'+this.props.sensor.id);
        this.state.ws.onopen = function(){
            this.setState({
                isOpen: true
            });
        }.bind(this);
        this.state.ws.onmessage = function(event){
            var str = event.data;
            var rec = {}
            if(this.isJsonString(str)){
                rec = JSON.parse(str);
            }
            if('results' in rec){
                this.setState({
                    data: rec.results
                });
            }
            if('id' in rec){
                this.state.data.push(rec);
                this.forceUpdate();
            }
        }.bind(this);
        this.state.ws.onclose = function(ev){
            this.setState({
                isOpen: false
            });
        }.bind(this);
        this.state.ws.onerror = function(ev){
            this.setState({
                hasError: true
            });
        }.bind(this);
        this.setState({
            ws: this.state.ws
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
        if (this.props.sensor !== prevProps.sensor) {
            // Do smth when Props change
        }
    }
    sendMessage(){
        this.state.ws.send(this.state.value);
    }
    sendInput(value, key){
        var newData = {};
        newData[key] = value;
        this.state.ws.send(JSON.stringify({"value": newData}));
    }
    renderSwitch(key, index, typedef){
        //console.log("key hgfj");

        if(typedef.hasOwnProperty(key)){
            //console.log(typedef[key].type);
            var data = [];
            for(var obj of this.state.data){
                if(obj.value && obj.value[key] !== undefined && obj.created.$date){
                    var dict = {}
                    dict.y = obj.value[key];
                    dict.x = obj.created.$date;
                    data.push(dict);
                }
            }

            //console.log(data);
            if(typedef[key].hasOwnProperty('type')){
                switch(typedef[key].type){
                    case 'Battery':
                        return (
                            <Battery
                                data={data.sort(function (a, b) {return a.x - b.x;})}
                                typedef={typedef[key]}
                                key={index}
                            />
                        );
                    case 'Boolean':
                        return(
                            <Boolean
                                data={data.sort(function (a, b) {return a.x - b.x;})}
                                typedef={typedef[key]}
                                key={index}
                                onSwitch={(value) => this.sendInput(value, key)}
                            />
                        )
                    case 'Wastebin':
                        return (
                            <Wastebin
                                data={data.sort(function (a, b) {return a.x - b.x;})}
                                typedef={typedef[key]}
                                key={index}
                            />
                        );
                    case 'Select':
                        return(
                            <SensorViewSelect
                                lastValue={data[data.length-1] && data[data.length-1].y}
                                typedef={typedef[key]}
                                key={index}
                                onChange={(value) => this.sendInput(value, key)}
                            />
                        )
                    default:
                        return (
                            <div></div>
                        );
                }
            }
        }
    }
    render(){
        return (
            <div className="container">
                {Object.keys(this.props.typedef).map( (key, index) => (
                    <div className="row mb-3">
                        <div className="col">
                            {this.renderSwitch(key, index, this.props.typedef)}
                        </div>
                    </div>
                    ))
                }
            </div>
        );
    }
}
