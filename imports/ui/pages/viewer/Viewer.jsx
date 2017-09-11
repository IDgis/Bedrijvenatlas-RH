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
        let extent = [-285401.92,22598.08,595401.9199999999,903401.9199999999];
        let resolutions = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420];
        let projection = new ol.proj.Projection({code:'EPSG:28992', units:'m', extent: extent});

        this.state.map  = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    title: 'osm',
                    source: new ol.source.OSM()
                }),
                /*new ol.layer.Tile({
                    title: 'brt achtergrondkaart',
                    source: new ol.source.TileImage({
                        projection: projection,
                        tileGrid: new ol.tilegrid.TileGrid({
                            origin: [-285401.92,22598.08],
                            resolutions: resolutions
                        }),
                        //tileUrlFunction: this.tileUrlFunction
                        tileUrlFunction: function(coordinate) {
                            if(coordinate === null) return undefined;

                            let z = coordinate[0];
                            let x = coordinate[1];
                            let y = coordinate[2];
                            if(x < 0 || y < 0) return '';

                            let url = 'http://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/'+z+'/'+x+'/'+y+'.png';
                            return url;
                        }
                    }),
                    visible: true,
                    //opacity: 0.7
                }),*/
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.luchtfoto,
                    preload: 1,
                    source: new ol.source.TileImage({
                        crossOrigin: null,
                        extent: extent,
                        projection: projection,
                        tileGrid: new ol.tilegrid.TileGrid({
                            extent: extent,
                            origin: [-285401.92,22598.08],
                            resolutions: resolutions
                        }),
                        tileUrlFunction: function(coordinate) {
                            if(coordinate === null) return undefined;

                            let z = coordinate[0];
                            let x = coordinate[1];
                            let y = coordinate[2];
                            if(x < 0 || y < 0) return '';

                            let url = 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2016_ortho25/EPSG:28992/'+z+'/'+x+'/'+y+'.jpeg';
                            return url;
                        }
                    }),
                    visible: false,
                }),
                new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.kadastralePercelen,
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://geodata.nationaalgeoregister.nl/kadastralekaartv3/wfs?service=WFS&' +
                                'version=1.1.0&request=GetFeature&resultType=results&typename=kadastralekaartv3:perceel&' +
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
                    title: Meteor.settings.public.laagNaam.kvk,
                    source: new ol.source.Vector({
                        url: '/data/KVK_BEDRIJVEN.json',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: false
                }),
                new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.ibis,
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
                    title: 'Funda Te Koop',
                    source: new ol.source.Vector({
                        url: '/data/funda.json',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: false
                }),
                new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.bagLigplaats,
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
                    title: Meteor.settings.public.laagNaam.bagPand,
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
                    title: Meteor.settings.public.laagNaam.bagStandplaats,
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
                    title: Meteor.settings.public.laagNaam.bagVerblijfsobject,
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
                })
            ],
            view: new ol.View({
                center: [229025, 479254],
                projection: 'EPSG:28992',
                zoom: 14,
            }),
            controls: [
                new ol.control.ScaleLine(),
                new ol.control.Zoom(),
                new ol.control.ZoomSlider()
            ],
            interactions: new ol.interaction.defaults().extend([
                new ol.interaction.Select()
            ])
        });

        this.setMapSettings();
        this.props.mapToParent(this.state.map);
    }

    /**
     * Sets the initial view based on the answers in the wizard screen
     */
    setMapSettings() {
        let plaats = Session.get('plaats');
        let voorkeur = Session.get('pand');
        let huurKoop = Session.get('huur-koop')

        if(voorkeur === 'nieuwbouw' && huurKoop === 'koop' && plaats === 'rijssen') {
            this.state.map.setView(new ol.View({
                center: [234927, 478849],
                projection: 'EPSG:28992',
                zoom: 17
            }));
        } else if(plaats === 'rijssen') {
            this.state.map.setView(new ol.View({
                center: [232992, 480308],
                projection: 'EPSG:28992',
                zoom: 14.5,
            }));
        } else if(plaats === 'holten') {
            this.state.map.setView(new ol.View({
                center: [225008, 477254],
                projection: 'EPSG:28992',
                zoom: 15.5,
            }));
        }

        let layers = this.state.map.getLayers();
        if(huurKoop === 'koop') {
            // show the te koop layer
            layers.forEach((layer, index, arr) => {
                if(layer.get('title') === 'Funda Te Koop') {
                    layer.setVisible(true);
                }
            });
        } else if(huurKoop === 'huur') {
            // show the te huur layer
            layers.forEach((layer, index, arr) => {
                if(layer.get('title') === 'Funda Te Huur') {
                    layer.setVisible(true);
                }
            });
        } else if(huurKoop === 'beide'){
            // turn both layers on
            layers.forEach((layer, index, arr) => {
                if(layer.get('title') === 'Funda Te Huur' || layer.get('title') === 'Funda Te Koop') {
                    layer.setVisible(true);
                }
            });
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