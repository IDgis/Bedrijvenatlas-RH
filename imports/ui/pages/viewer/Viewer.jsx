import React, { Component } from 'react';
import * as ol from 'openlayers';
import proj4 from 'proj4';
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
            menuOpen: this.props.menuOpen
        };

        proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        ol.proj.setProj4(proj4);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuOpen: nextProps.menuOpen
        });
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
                        format: new ol.format.GeoJSON()
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
                                'outputFormat=application/json&srsname=EPSG:28992&' +
                                'bbox=' + extent.join(',') + ',EPSG:28992';
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
                                'outputFormat=application/json&srsname=EPSG:28992&' +
                                'bbox=' + extent.join(',') + ',EPSG:28992';
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
                                'outputFormat=application/json&srsname=EPSG:28992&' +
                                'bbox=' + extent.join(',') + ',EPSG:28992';
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
                                'outputFormat=application/json&srsname=EPSG:28992&' +
                                'bbox=' + extent.join(',') + ',EPSG:28992';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    }),
                    visible: false
                }),
            ],
            view: this.setView(),
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
                center: [232992, 480308],
                projection: 'EPSG:28992',
                zoom: 14.5,
            });
        } else if(plaats === 'holten') {
            return new ol.View({
                center: [225008, 477254],
                projection: 'EPSG:28992',
                zoom: 15.5,
            });
        } else {
            return new ol.View({
                center: [229025, 479254],
                projection: 'EPSG:28992',
                zoom: 14,
            })
        }
    }

    /**
     * Opens and closes the value whether the menu should be opened or closed
     */
    toggleMenuState = (newState) => {
        this.props.toggleMenuState(newState);
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
                    menuOpen={this.props.menuOpen}
                    toggleMenuState={this.toggleMenuState}
                    featurePopup={this.props.featurePopup}
                />
            </div>
        );
    }
}