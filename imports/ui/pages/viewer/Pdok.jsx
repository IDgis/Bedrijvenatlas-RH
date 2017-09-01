import React, { Component } from 'react';
import * as ol from 'openlayers';
import './viewer.css';

import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

let styles = {
    map: {
        height: '840px'
    }
}

const extent = [-285401.92,22598.08,595401.9199999999,903401.9199999999];
const resolutions = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420];
const projection = new ol.proj.Projection({code:'EPSG:28992', units:'m', extent: extent});
const url = 'http://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/';

let tileUrlFunction = function(tileCoord, pixelRatio, projection) {
    var zxy = tileCoord;
    if(zxy[1] < 0 || zxy[2] < 0) {
        return "";
    }
    return url + 
        zxy[0].toString()+'/'+ zxy[1].toString() +'/'+
        zxy[2].toString() +'.png';
};

export default class Viewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: null,
            menuopen: false
        }
    }

    componentDidMount() {
        this.state.map  = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Vector({
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://geodata.nationaalgeoregister.nl/bag/wfs?service=WFS&' +
                                'version=1.1.0&request=GetFeature&typename=bag:pand&' +
                                'outputFormat=application/json&srsname=EPSG:28992&' +
                                'bbox=' + extent.join(',') + ',EPSG:28992';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    })
                })
            ],
            view: new ol.View({
                minZoom: 3,
                maxZoom: 13,
                projection: projection,
                center: [225000, 500000],
                zoom: 3
            }),
            controls: [
                new ol.control.ScaleLine(),
                new ol.control.Zoom(),
                new ol.control.ZoomSlider()
            ]
        });
    }

    render() {
        return (
            <div 
                id="map" 
                className="map" 
                ref="olmap" 
                style={styles.map}
            >
                <Drawer open={this.props.openMenu} openSecondary={true}>
                    <List>
                        <Subheader>Achtergrond kaarten</Subheader>
                        <ListItem primaryText="OpenStreetMaps" leftCheckbox={<Checkbox checked={false} />} />
                        <ListItem primaryText="Luchtfoto" leftCheckbox={<Checkbox />} />
                    </List>
                </Drawer>
            </div>
        );
    }
}