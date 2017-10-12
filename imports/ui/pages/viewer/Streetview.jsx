import React, { Component } from 'react';
import ReactStreetView from 'react-streetview';

import RaisedButton from 'material-ui/RaisedButton';


export default class Streetview extends Component {
    
        constructor(props) {
            super(props);
    
            this.state = {
                streetview: <div></div>
            }
        }
    
        render() {
            const lng = this.props.coords[0];
            const lat = this.props.coords[1];
            
            const streetViewPanoramaOptions = {
                position: {lng: lng, lat: lat},
                pov: {heading: 100, pitch: 0},
                zoom: 1
            };

            return(
                <div style={{width: '400px', height: '400px', position: 'absolute', top: (window.innerHeight-56-400), right: 0, zIndex:2}}>
                    <ReactStreetView 
                        apiKey='AIzaSyDSK_RTj2gR5YKl_TxgQidR9NkuHCpHi0I'
                        streetViewPanoramaOptions={streetViewPanoramaOptions}
                    />
                    <RaisedButton label='Sluiten' style={{position: 'absolute', bottom: 0, left: 0, zIndex:3}} onClick={this.props.close} />
                </div>
            );
        }
    }