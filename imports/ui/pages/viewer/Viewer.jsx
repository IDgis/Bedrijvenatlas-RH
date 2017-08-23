import React, { Component } from 'react';
import * as ol from 'openlayers';
import './viewer.css';

import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import LayerMenu from './components/LayerMenu.jsx';

let styles = {
    map: {
        height: '840px'
    }
}

export default class Viewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: null,
            menuopen: false,
        };
    }

    /**
     * Sets up the initial OpenLayers map
     */
    componentDidMount() {
        this.state.map  = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                new ol.layer.Vector({
                    title: 'Kvk Bedrijven',
                    source: new ol.source.Vector({
                        url: '/data/KVK_BEDRIJVEN.json',
                        format: new ol.format.GeoJSON({
                            defaultDataProjection: 'EPSG:28992'
                        })
                    }),
                    visible: false
                }),
                new ol.layer.Vector({
                    title: 'Ibis Bedrijventerreinen',
                    source: new ol.source.Vector({
                        url: '/data/IBIS_BEDRIJVENTERREINEN.json',
                        format: new ol.format.GeoJSON()
                    }),
                    style: function(feature) {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                width: 2,
                                color: 'rgba(71, 180, 234, 1)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(71, 180, 234, 0.4)'
                            }),
                            text: new ol.style.Text({
                                text: feature.get('BEDRIJVENT'),
                                font: 'bold 16px Arial'
                            })
                        });
                    },
                    visible: false
                }),
                new ol.layer.Vector({
                    title: 'BAG Ligplaats',
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://geodata.nationaalgeoregister.nl/bag/wfs?service=WFS&' +
                                'version=1.1.0&request=GetFeature&typename=bag:ligplaats&' +
                                'outputFormat=application/json&srsname=EPSG:3857&' +
                                'bbox=' + extent.join(',') + ',EPSG:3857';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    }),
                    visible: false
                }),
                new ol.layer.Vector({
                    title: 'BAG Pand',
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://geodata.nationaalgeoregister.nl/bag/wfs?service=WFS&' +
                                'version=1.1.0&request=GetFeature&typename=bag:pand&' +
                                'outputFormat=application/json&srsname=EPSG:3857&' +
                                'bbox=' + extent.join(',') + ',EPSG:3857';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    }),
                    visible: false
                }),
                new ol.layer.Vector({
                    title: 'BAG Standplaats',
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://geodata.nationaalgeoregister.nl/bag/wfs?service=WFS&' +
                                'version=1.1.0&request=GetFeature&typename=bag:standplaats&' +
                                'outputFormat=application/json&srsname=EPSG:3857&' +
                                'bbox=' + extent.join(',') + ',EPSG:3857';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    }),
                    visible: false
                }),
                new ol.layer.Vector({
                    title: 'BAG Verblijfsobject',
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://geodata.nationaalgeoregister.nl/bag/wfs?service=WFS&' +
                                'version=1.1.0&request=GetFeature&typename=bag:verblijfsobject&' +
                                'outputFormat=application/json&srsname=EPSG:3857&' +
                                'bbox=' + extent.join(',') + ',EPSG:3857';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    }),
                    visible: false
                }),
                new ol.layer.Vector({
                    title: 'BAG Woonplaats',
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://geodata.nationaalgeoregister.nl/bag/wfs?service=WFS&' +
                                'version=1.1.0&request=GetFeature&typename=bag:woonplaats&' +
                                'outputFormat=application/json&srsname=EPSG:3857&' +
                                'bbox=' + extent.join(',') + ',EPSG:3857';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    }),
                    visible: false
                }),
            ],
            view: this.setView(), // EPSG: 3857
            controls: [
                new ol.control.ScaleLine(),
                new ol.control.Zoom(),
                new ol.control.ZoomSlider()
            ],
            interactions: new ol.interaction.defaults().extend([
                new ol.interaction.Select()
            ])
        });

        this.props.mapToParent(this.state.map);

        console.log('Projection: ' + this.state.map.getView().getProjection().getCode());
    }

    /**
     * Sets the initial view based on the answers in the wizard screen
     */
    setView() {
        let plaats = Session.get('plaats');

        if(plaats === 'rijssen') {
            return new ol.View({
                center: [727000, 6855500],
                zoom: 14,
            });
        } else if(plaats === 'holten') {
            return new ol.View({
                center: [713900, 6850700],
                zoom: 15
            });
        } else {
            return new ol.View({
                center: [720500, 6853875],
                zoom: 13.5
            })
        }
    }

    /**
     * Renders the map from OpenLayers to the screen
     */
    render() {
        return (
            <div 
                id="map" 
                className="map" 
                ref="olmap" 
                style={styles.map} 
            >
                <LayerMenu
                    map={this.state.map}
                    openMenu={this.props.openMenu}
                />
            </div>
        );
    }
}