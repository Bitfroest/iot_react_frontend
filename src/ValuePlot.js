import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import 'react-vis/dist/style.css'
import {FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import Highlight from './highlight';
import {curveMonotoneX} from 'd3-shape';

export default class ValuePlot extends React.Component{
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
    render(){
        return (
            <div className="">
                <div className="row mb-3">
                    <div className="col">
                        {this.props.typedef.label && <label for={'ValuePlot_' + this.props.key}>{this.props.typedef.label}</label>}
                        <h4 id={'ValuePlot_' + this.props.key}> {this.props.lastValue} {this.props.typedef.unit}</h4>
                    </div>
                    <div className="col">
                        <button className="btn btn-secondary float-right" onClick={() => {this.setState({ toggleGraph: !this.state.toggleGraph});}}>
                            show history
                        </button>
                    </div>
                </div>
                {this.state.toggleGraph &&
                <div className="container">
                    <div className="row mb-3">
                        <div className="col">
                            <FlexibleWidthXYPlot
                                height={this.props.typedef.FlexibleWidthXYPlot.height}
                                xType={this.props.typedef.FlexibleWidthXYPlot.xType}
                                xDomain={this.state.lastDrawLocation && [this.state.lastDrawLocation.left, this.state.lastDrawLocation.right]}
                                yDomain={this.props.typedef.FlexibleWidthXYPlot.yDomain}
                                >
                                <HorizontalGridLines />

                                <LineSeries
                                    data={this.props.data}
                                    curve={curveMonotoneX}
                                    />

                                <Highlight onBrushEnd={(area) => {
                                    this.setState({
                                        lastDrawLocation: area
                                    });
                                }} />

                                <XAxis />
                                <YAxis />
                            </FlexibleWidthXYPlot>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <button className="btn btn-primary" onClick={() => {
                                this.setState({lastDrawLocation: null});
                            }}>
                                Reset Zoom
                            </button>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                        {this.state.lastDrawLocation ? (
                            <ul style={{listStyle: 'none'}}>
                                <li><b>Top:</b> {this.state.lastDrawLocation.top}</li>
                                <li><b>Right:</b> {this.state.lastDrawLocation.right.toString()}</li>
                                <li><b>Bottom:</b> {this.state.lastDrawLocation.bottom}</li>
                                <li><b>Left:</b> {this.state.lastDrawLocation.left.toString()}</li>
                            </ul>
                          ) : <span>N/A</span>
                        }
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}
