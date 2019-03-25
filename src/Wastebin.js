import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

export default class Wastebin extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            lastValue: null,
            lastDrawLocation: null,
            toggleGraph: false,
        }
    };
    componentDidMount(){

    }
    getColor(value){
        //value from 0 to 1
        // red is shows when Wastebin is full, green when Wastebin is empty
        var hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",100%,50%)"].join("");
    }
    getHeight(value){
        var height=((value/2.5)*100).toString(10);
        return height + "px";
    }
    render(){
        var value = this.props.data[this.props.data.length-1] && this.props.data[this.props.data.length-1].y;
        return (
            <div className="row mb-3">
                <div className="col">
                    {this.props.typedef.label && <label for={'wastebin_' + this.props.key} style={{display: 'block'}}>{this.props.typedef.label}</label>}
                    <div className="trash" id={'wastebin_' + this.props.key} style={this.props.typedef.hasOwnProperty('position') && this.props.typedef.position=='center' ? {"display": "block"} : {}}>
                        <div className="icon-trash">
                            <div className="trash-lid" style={{"background-color":this.getColor(value)}}></div>
                            <div className="trash-container"style={{"background-color":this.getColor(value)}}></div>
                            <div className="trash-line-1"></div>
                            <div className="trash-line-2"></div>
                            <div className="trash-line-3"></div>
                            <div className="trash-filling" style={{"background-color":this.getColor(value),"height":this.getHeight(value)}}></div>
                        </div>
                        <h4 id={this.props.key} className="trash-text">
                            {isNaN(value) ? 0 : Math.round(100*value)}%
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}
