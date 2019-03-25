import React, { Component } from 'react'
import Leaflet from 'leaflet'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

Leaflet.Icon.Default.imagePath = '/images/';

/**
* Renders the Map of a Site's coordinates
* @prop {Array<Integer>} positions the positions to show on the map.
*/
export default class SensorMap extends React.Component{
        constructor(props) {
        super(props);
                /**
                * The Default Viewport of the map.
                * @lends SensorMap
                */
                const DEFAULT_VIEWPORT = {
                    center: [0, 0],
                    zoom: 15
                }
        this.state = {
            initViewport: DEFAULT_VIEWPORT,
            initSet: false,
            viewport: props.viewport,
        }
    }
        /**
        * Resets the viewport of the map to the initial viewport.
        */
        onClickReset = () => {
                this.setState({ viewport: this.state.initViewport })
        }
        /**
        * Will be called if the user changed the viewport.
        */
        onViewportChanged = viewport => {
            if(!this.state.initSet){
                this.setState({ initSet: true,
                    initViewport: viewport });
            }
                this.setState({ viewport })
        }
        /**
    * Will be immediately and automatically called by ReactJS when the component
    * did mount.
        */
    componentDidMount(){
        this.setState({viewport: this.props.viewport});
    }
        /**
    * Will be immediately and automatically called by ReactJS when the component
    * did update.
        */
    componentDidUpdate(prevProps, prevState){
        if (this.props.viewport !== prevProps.viewport) {
            this.setState({viewport: this.props.viewport});
        }
    }
        render() {
                return (
                    <Map
                        onClick={this.onClickReset}
                        onViewportChanged={this.onViewportChanged}
                        viewport={this.state.viewport}
                        scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        />
                        {this.props.positions.map((position, index) =>
                            <Marker position={position} key={index}>
                                <Popup>
                                    <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                                </Popup>
                            </Marker>
                        )}
                    </Map>
                )
        }
}
