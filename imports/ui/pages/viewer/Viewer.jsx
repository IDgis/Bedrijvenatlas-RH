import React, { Component } from 'react';
import * as ol from 'openlayers';
import proj4 from 'proj4';
import './viewer.css';

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';

import LayerMenu from './components/LayerMenu.jsx';


export default class Viewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: null,
            menuOpen: false
        };

        proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        ol.proj.setProj4(proj4);
    }

    /**
     * Sets up the initial OpenLayers map and layers
     */
    componentDidMount() {
        let extent = [-285401.92,22598.08,595401.9199999999,903401.9199999999];
        let resolutions = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420];
        let projection = new ol.proj.Projection({code:'EPSG:28992', units:'m', extent: extent});
        let matrixIds = [];

        for(let i = 0; i < 16; i++) {
            matrixIds[i] = 'EPSG:28992:' + i.toString();
        }

        this.state.map  = new ol.Map({
            target: 'map',
            layers: [
                // BRT Achtergrondkaart TMS
                new ol.layer.Tile({
                    title: 'brt achtergrondkaart',
                    preload: 1,
                    source: new ol.source.TileImage({
                        crossOrigin: null,
                        extent: extent,
                        projection: projection,
                        tileGrid: new ol.tilegrid.TileGrid({
                            extent: extent,
                            resolutions: resolutions
                        }),
                        url: 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{-y}.png'
                    }),
                    visible: true,
                }),
                // Luchtfoto WMTS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.luchtfoto,
                    source: new ol.source.WMTS({
                        url: 'http://rijssen-holten.ecw-hosting.nl/lufo/services/wmts_rijssen_holten',
                        layer: 'Rijssen_Holten',
                        matrixSet: 'NLDEPSG28992Scale',
                        format: 'image/jpg',
                        projection: projection,
                        style: 'default',
                        tileGrid: new ol.tilegrid.WMTS({
                            origin: [-285401.92,903401.92],
                            resolutions: resolutions,
                            matrixIds: matrixIds
                        })
                    }),
                    visible: false
                }),
                // Kadastrale percelen WMS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.kadastralePercelen,
                    source: new ol.source.TileWMS({
                        url: 'https://geodata.nationaalgeoregister.nl/kadastralekaartv3/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'kadastralekaart',
                            'CRS': 'EPSG:28992'
                        },
                    }),
                    visible: false
                }),
                // BAG Woonplaats/Pand/Ligplaats/Standplaats
                /*new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.bagPand,
                    source: new ol.source.TileWMS({
                        url: 'https://geodata.nationaalgeoregister.nl/bag/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'bag',
                            'CRS': 'EPSG:28992'
                        }
                    }),
                    visible: false
                }),*/
                // BAG Pand WMS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.bagPand,
                    source: new ol.source.TileWMS({
                        url: 'https://geodata.nationaalgeoregister.nl/bag/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'pand',
                            'CRS': 'EPSG:28992'
                        }
                    }),
                    visible: false
                }),
                // BAG Ligplaats WMS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.bagLigplaats,
                    source: new ol.source.TileWMS({
                        url: 'https://geodata.nationaalgeoregister.nl/bag/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'ligplaats',
                            'CRS': 'EPSG:28992'
                        }
                    }),
                    visible: false
                }),
                // Bag Standplaats WMS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.bagStandplaats,
                    source: new ol.source.TileWMS({
                        url: 'https://geodata.nationaalgeoregister.nl/bag/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'standplaats',
                            'CRS': 'EPSG:28992'
                        }
                    }),
                    visible: false
                }),
                // Milieu categoriën WMS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.milieu,
                    source: new ol.source.TileWMS({
                        url: 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_RO_categorie_indeling_service/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'Bedrijventerreinen_RO_categorie_indeling',
                            'CRS': 'EPSG:28992'
                        }
                    }),
                    visible: false
                }),
                // Bedrijventerreinen WMS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.ibis,
                    source: new ol.source.TileWMS({
                        url: 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_Rijssen-Holten_service/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'Bedrijventerreinen_Rijssen-Holten',
                            'CRS': 'EPSG:28992'
                        },
                    }),
                    visible: false
                }),
                /*new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.ibis,
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_Rijssen-Holten_service/wfs?' +
                                'service=wfs&version=1.1.0&request=GetFeature&outputFormat=application/json&resultType=results' +
                                '&typeName=Bedrijventerreinen_Rijssen-Holten_service:Bedrijventerreinen_Rijssen-Holten&srs=EPSG:28992' +
                                '&bbox=' + extent.join(',') + ',EPSG:28992';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        })),
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
                                text: feature.get('BEDR_TERR'),
                                font: 'bold 16px Arial'
                            })
                        });
                    },
                    visible: false
                }),*/
                // Uitgifte kavels WFS
                new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.kavels,
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent, resolution, projection) {
                            return 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_uitgifte_kavels_service/wfs?' +
                            'service=wfs&version=1.1.0&request=GetFeature&outputFormat=application/json&resultType=results' +
                            '&typeName=Bedrijventerreinen_uitgifte_kavels_service:Bedrijventerreinen_uitgifte_kavels&srs=EPSG:28992' +
                            '&bbox=' + extent.join(',') + ',EPSG:28992';
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 20
                        }))
                    }),
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: 2,
                            color: 'rgba(71, 180, 234, 1)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(71, 180, 234, 0.4)'
                        })
                    }),
                    visible: false
                }),
                // BAG Verblijfsobjecten WMS
                new ol.layer.Tile({
                    title: Meteor.settings.public.laagNaam.bagVerblijfsobject,
                    source: new ol.source.TileWMS({
                        url: 'https://geodata.nationaalgeoregister.nl/bag/ows?SERVICE=WMS&',
                        params: {
                            'FORMAT': 'image/png',
                            'LAYERS': 'verblijfsobject',
                            'CRS': 'EPSG:28992'
                        }
                    }),
                    visible: false
                }),
                // Te koop GeoJSON
                new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.teKoop,
                    source: new ol.source.Vector({
                        url: Meteor.settings.public.teKoopJsonUrl,
                        format: new ol.format.GeoJSON(),
                    }),
                    style: [
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.iconKoop,
                                scale: 0.5
                            }),
                            zIndex: 1
                        }),
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.iconShadow,
                                scale: 0.5,
                                opacity: 0.7
                            }),
                            zIndex: 0
                        })
                    ],
                    visible: false
                }),
                // Te huur GeoJSON
                new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.teHuur,
                    source: new ol.source.Vector({
                        url: Meteor.settings.public.teHuurJsonUrl,
                        format: new ol.format.GeoJSON()
                    }),
                    style: [
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.iconHuur,
                                scale: 0.5
                            }),
                            zIndex: 1
                        }),
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.iconShadow,
                                scale: 0.5,
                                opacity: 0.7
                            }),
                            zIndex: 0
                        })
                    ],
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
                //new ol.control.ZoomSlider()
            ],
            interactions: new ol.interaction.defaults().extend([
                new ol.interaction.Select({
                    style: [
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.iconSelected,
                                scale: 0.5
                            }),
                            zIndex: 1
                        }),
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.iconShadow,
                                scale: 0.5
                            }),
                            zIndex: 0
                        })
                    ]
                })
            ])
        });

        this.setMapSettings();
        this.addKvkLayers();
        this.props.mapToParent(this.state.map);
    }

    /**
     * Sets the initial view based on the answers in the wizard screen
     */
    setMapSettings() {
        let laagNaam = Meteor.settings.public.laagNaam;
        let map = this.state.map;
        let layers = map.getLayers();

        let plaats = Session.get('plaats');
        let voorkeur = Session.get('pand');
        let huurKoop = Session.get('huur-koop')

        // Zoom to the right place
        if(plaats === 'rijssen' && voorkeur === 'nieuwbouw') {
            map.setView(new ol.View({
                center: [234927, 478849],
                projection: 'EPSG:28992',
                zoom: 17
            }));
        } else if(plaats === 'rijssen') {
            map.setView(new ol.View({
                center: [231657, 480800],
                projection: 'EPSG:28992',
                zoom: 14.5
            }));
        } else if(plaats === 'holten') {
            map.setView(new ol.View({
                center: [225008, 477254],
                projection: 'EPSG:28992',
                zoom: 15
            }));
        }

        // Set the visibility of the layers
        if(voorkeur === 'bestaand' || voorkeur === 'beide') {
            if(huurKoop === 'koop') {
                layers.forEach((layer, index) => {
                    if(layer.get('title') === laagNaam.teKoop) {
                        layer.setVisible(true);
                    }
                });
            } else if(huurKoop === 'huur') {
                layers.forEach((layer, index) => {
                    if(layer.get('title') === laagNaam.teHuur) {
                        layer.setVisible(true);
                    }
                });
            } else if(huurKoop === 'beide') {
                layers.forEach((layer, index) => {
                    let title = layer.get('title');
                    if(title === laagNaam.teKoop || title === laagNaam.teHuur) {
                        layer.setVisible(true);
                    }
                });
            }
        }

        // Set the kavels layer visible
        if(voorkeur === 'nieuwbouw' || voorkeur === 'beide') {
            layers.forEach((layer, index) => {
                if(layer.get('title') === laagNaam.kavels) {
                    layer.setVisible(true);
                }
            });
        }
    }

    /**
     * Add all kvk layers by SBI code
     */
    addKvkLayers() {
        let categorien = Meteor.settings.public.categorieUrl;
        let that = this;

        for(c in categorien) {
            let categorieNaam = c[0];

            let featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:28992',
                outputFormat: 'application/json',
                featurePrefix: 'Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres_service',
                featureTypes: ['Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres'],
                filter: ol.format.filter.equalTo('SBI_RUBR_C', categorieNaam)
            });
            
            fetch('https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres_service/wfs', {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest)
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                let features = new ol.format.GeoJSON().readFeatures(json);
                let source = new ol.source.Vector();
                let layer = new ol.layer.Vector({
                    title: Meteor.settings.public.laagNaam.kvk,
                    source: source,
                    style: [
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.categorieUrl[categorieNaam],
                                scale: 0.5
                            }),
                            zIndex: 1
                        }),
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: Meteor.settings.public.iconShadow,
                                scale: 0.5,
                                opacity: 0.7
                            }),
                            zIndex: 0
                        })
                    ],
                    visible: false
                });
                source.addFeatures(features);
                that.state.map.addLayer(layer);
            })
        }
    }

    /**
     * Toggles the state of the menu between open and closed
     */
    openMenu = (evt) => {
        this.setState({
            menuOpen: true,
            anchorEl: evt.currentTarget
        });
        document.getElementById('map').focus();
    }

    closeMenu = () => {
        this.setState({
            menuOpen: false
        });
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        /*if(this.state.map) {
            let viewport = document.getElementsByClassName('ol-viewport').item(0);
            viewport.setAttribute('style','position: relative; overflow: hidden; width: 100%; height: 100% !important; touch-action: none;');
        }*/

        return (
            <div id="map" className="map" >
                <IconButton className='menu-button' style={{backgroundColor:Meteor.settings.public.colorGemeente}} onClick={this.openMenu} >
                    <img src={Meteor.settings.public.iconMenu} />
                </IconButton>
                <IconButton className='home-button' href='/' style={{backgroundColor:Meteor.settings.public.colorGemeente}} >
                    <img src={Meteor.settings.public.iconHome} />
                </IconButton>
                <LayerMenu
                    map={this.state.map}
                    menuOpen={this.state.menuOpen}
                    closeMenu={this.closeMenu}
                    anchorEl={this.state.anchorEl}
                />
            </div>
        );
    }
}