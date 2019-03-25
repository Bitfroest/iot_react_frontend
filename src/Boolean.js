import React, { Component } from 'react';
import ReactDom from "react-dom"
import Switch from "react-switch"
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBell from '@fortawesome/fontawesome-free-solid/faBell'

export default class Boolean extends React.Component{
    constructor(props) {
        super(props);
        this.state = { checked: false };
    }

    componentDidUpdate(prevProps){
        if (this.props.data[this.props.data.length-1] !== prevProps.data[prevProps.data.length-1]) {
            this.setState({checked : this.props.data[this.props.data.length-1] && this.props.data[this.props.data.length-1].y});
        }
    }
    getColor(value){
        //value from 0 to 1
        var hue=((value)*120).toString(10);
        return ["hsl(",hue,",100%,50%)"].join("");
    }
    getParkingLotSVG(color){
        return(
            <svg width="82.5" height="100" version="1.1" viewBox="0 0 14111.11 17111.111" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="14111" height="14111" fill="#0061ff"/>
                <g transform="translate(56.444)" fill="#fff">
                    <path d="m5101.4 3282.7v3170.7h2212.7c553.17 0.01 964.68-166.4 1234.5-499.21 274.33-332.8 411.5-694.84 411.51-1086.1-0.01-593.65-213.63-1029.9-640.88-1308.7-274.35-184.38-627.39-276.58-1059.1-276.59h-2158.7m-1490.9 8419.1v-9829h3568.7c382.27 0.01 748.81 40.486 1099.6 121.43 355.29 80.963 724.07 269.85 1106.4 566.67 296.82 229.38 548.67 546.44 755.56 951.2 206.87 400.27 310.31 865.75 310.32 1396.4 0 701.6-263.1 1369.5-789.29 2003.6-521.7 634.14-1286.3 951.2-2293.7 951.2h-2266.7v4459.4h-1490.9" fill="#fff"/>
                </g>
                <g>
                    <rect x="0" y="14111" width="14111" height="3000" fill={color}/>
                    <text text-anchor="middle" x="7055.5" y="16611" font-family="Calibri" font-size="3000" fill="white">{color=='green'? 'Frei' : 'Belegt'}</text>
                </g>
            </svg>
        );
    }
    renderDefault(){
        return (
            <div className="">
                <div className="row mb-3">
                    <div className="col">
                        <label>{this.props.typedef.hasOwnProperty('label') ? this.props.typedef.label : ''}</label>
                        <div className={this.props.typedef.hasOwnProperty('position') && this.props.typedef.position=='center' ? "boolean-center" : "boolean-left"}>
                            <Switch
                                disabled={this.props.typedef.isDisabled}
                                onChange={(value) => this.props.onSwitch(value)}
                                checked={this.state.checked}
                                id="normal-switch"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render(){
        if(this.props.typedef.hasOwnProperty('style')){
            switch(this.props.typedef.style){
                case 'Alarm':
                    return (
                        <div className="">
                            <div className="row mb-3">
                                <div className="col">
                                    <label>{this.props.typedef.hasOwnProperty('label') ? this.props.typedef.label : ''}</label>
                                    <div className={this.props.typedef.hasOwnProperty('position') && this.props.typedef.position=='center' ? "boolean-center" : "boolean-left"}>
                                        <FontAwesomeIcon
                                            size={this.props.typedef.hasOwnProperty('size') ? this.props.typedef.size : '4x'}
                                            color={this.props.data[this.props.data.length-1] && this.props.data[this.props.data.length-1].y ? 'red' : null}
                                            icon={faBell}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'ParkingLot':
                    return (
                        <div className="">
                            <div className="row mb-3">
                                <div className="col">
                                    <label>{this.props.typedef.hasOwnProperty('label') ? this.props.typedef.label : ''}</label>
                                    <div className={this.props.typedef.hasOwnProperty('position') && this.props.typedef.position=='center' ? "boolean-center" : "boolean-left"}>
                                        {this.getParkingLotSVG(this.props.data[this.props.data.length-1] && this.props.data[this.props.data.length-1].y ? 'red' : 'green')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                default:
                    return (
                        this.renderDefault()
                    )
            }
        }
        else {
            return (
                this.renderDefault()
            )
        }
    }
}
