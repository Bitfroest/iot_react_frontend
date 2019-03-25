import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

export default class Battery extends React.Component{
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
        var hue=((value)*120).toString(10);
        return ["hsl(",hue,",100%,50%)"].join("");
    }
    getWidth(value){
        var width=((value)*100).toString(10);
        return width + "px";
    }
    render(){
        return (
            <div className="">
                <div className="row mb-3">
                    <div className="col">
                        <div className="battery-background"
                            style={{"background-color":this.getColor(this.props.data[this.props.data.length-1] && this.props.data[this.props.data.length-1].y), "width":this.getWidth(this.props.data[this.props.data.length-1] && this.props.data[this.props.data.length-1].y)}}>
                            <div className="battery">
                                <h4 className="battery-text"> {this.props.data[this.props.data.length-1] && (Math.round(100*this.props.data[this.props.data.length-1].y))}%</h4>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
