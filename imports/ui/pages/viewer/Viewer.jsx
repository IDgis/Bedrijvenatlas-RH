import React, { Component } from 'react';
import * as ol from 'openlayers';
import proj4 from 'proj4';
import 'whatwg-fetch';

import IconButton from 'material-ui/IconButton';

import LayerMenu from './components/LayerMenu.jsx';
import Legenda from './components/Legenda.jsx';
import SearchBar from './components/MenuItems/SearchBar.jsx';


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
        this.state.map = new ol.Map({
            target: 'map',
            layers: this.getMapLayers(),
            view: new ol.View({
                center: Meteor.settings.public.gemeenteConfig.center,
                projection: 'EPSG:28992',
                zoom: Meteor.settings.public.gemeenteConfig.zoom,
                extent: Meteor.settings.public.gemeenteConfig.extent,
                minZoom: Meteor.settings.public.gemeenteConfig.minZoom
            }),
            controls: [
                //new ol.control.ScaleLine(),
                new ol.control.Zoom(),
                new ol.control.Attribution({
                    target: 'map',
                    className: 'attribution'
                })
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
        this.setBackgroundLayer();
        this.addKvkLayers(Meteor.settings.public.kvkBedrijven);
        this.props.mapToParent(this.state.map);
    }

    /**
     * Returns all Layers to add to the Map
     */
    getMapLayers = () => {
        const allLayers = [];

        const baseLayers = Meteor.settings.public.baseLayers;
        const overlayLayers = Meteor.settings.public.overlayLayers;
        const fundaLayers = Meteor.settings.public.fundaLayers;

        this.addLayers(baseLayers, allLayers);
        this.addLayers(overlayLayers, allLayers);
        this.addLayers(fundaLayers, allLayers);

        return allLayers;
    }

    /**
     * Adds all layers to the existing array of layers
     * 
     * @param {Array} layers The layers array to add
     * @param {Array} allLayers All layers will be added to this array
     */
    addLayers = (layers, allLayers) => {
        const extent = [-285401.92,22598.08,595401.92,903401.92];
        const projection = new ol.proj.Projection({code: 'EPSG:28992', units: 'm', extent: extent});
        const matrixIds = [];

        for (let i = 0; i < 16; i++) {
            matrixIds[i] = 'EPSG:28992:' + i.toString();
        }

        layers.forEach(layer => {
            const service = layer.service;

            if (service === 'tms') {
                allLayers.push(this.getTmsLayer(layer, extent, projection));
            } else if (service === 'wmts') {
                allLayers.push(this.getWmtsLayer(layer, projection, matrixIds));
            } else if (service === 'wms') {
                allLayers.push(this.getWmsLayer(layer));
            } else if (service === 'geojson') {
                allLayers.push(this.getGeoJsonLayer(layer));
            }
        });
    }

    /**
     * Creates an OpenLayers TMS Layer
     * 
     * @param {Object} tmsLayer The TMS Layer object to convert to an OpenLayers Object
     * @param {Array} extent The extent of the layer
     * @param {Object} projection The projection object of the given layer
     */
    getTmsLayer = (tmsLayer, extent, projection) => (
        new ol.layer.Tile({
            title: tmsLayer.titel,
            preload: 1,
            source: new ol.source.TileImage({
                crossOrigin: null,
                extent: extent,
                projection: projection,
                tileGrid: new ol.tilegrid.TileGrid({
                    extent: extent,
                    resolutions: tmsLayer.resolutions
                }),
                url: tmsLayer.url
            }),
            visible: tmsLayer.visible
        })
    );

    /**
     * Creates an OpenLayers WMTS Layer
     * 
     * @param {Object} wmtsLayer The WMTS Layer object to convert to an OpenLayers Object
     * @param {Object} projection The projection object of the given layer
     * @param {Array} matrixIds The matrixIds to use for this layer
     */
    getWmtsLayer = (wmtsLayer, projection, matrixIds) => (
        new ol.layer.Tile({
            title: wmtsLayer.titel,
            source: new ol.source.WMTS({
                attributions: this.getAttributions(wmtsLayer.attributions),
                url: wmtsLayer.url,
                layer: wmtsLayer.layer,
                matrixSet: wmtsLayer.matrixSet,
                format: wmtsLayer.format,
                projection: projection,
                style: wmtsLayer.style,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: wmtsLayer.origin,
                    resolutions: wmtsLayer.resolutions,
                    matrixIds: matrixIds
                })
            }),
            visible: wmtsLayer.visible
        })
    );

    /**
     * Creates an OpenLayers WMS Layer
     * 
     * @param {Object} wmsLayer The WMS Layer object to convert to an OpenLayers Object
     */
    getWmsLayer = (wmsLayer) => (
        wmsLayer.tiling ?
        new ol.layer.Tile({
            title: wmsLayer.titel,
            source: new ol.source.TileWMS({
                url: wmsLayer.url,
                params: {
                    'FORMAT': wmsLayer.format,
                    'LAYERS': wmsLayer.layers,
                    'CRS': 'EPSG:28992'
                }
            }),
            visible: wmsLayer.visible
        }) :
        new ol.layer.Image({
            title: wmsLayer.titel,
            source: new ol.source.ImageWMS({
                url: wmsLayer.url,
                params: {
                    'FORMAT': wmsLayer.format,
                    'LAYERS': wmsLayer.layers,
                    'CRS': 'EPSG:28992'
                }
            }),
            visible: wmsLayer.visible
        })
    )

    /**
     * Creates an OpenLayers GeoJSON Layer
     * 
     * @param {Object} geoJsonLayer The GeoJson Layer object to convert to an OpenLayers Object
     */
    getGeoJsonLayer = (geoJsonLayer) => (
        new ol.layer.Vector({
            title: geoJsonLayer.titel,
            source: new ol.source.Vector({
                url: geoJsonLayer.url,
                format: new ol.format.GeoJSON()
            }),
            style: [
                new ol.style.Style({
                    image: new ol.style.Icon({
                        src: geoJsonLayer.icon,
                        imgSize: [ 48, 48 ], // for IE11
                        scale: 0.5
                    }),
                    zIndex: 1
                }),
                new ol.style.Style({
                    image: new ol.style.Icon({
                        src: geoJsonLayer.shadow,
                        scale: 0.5,
                        opacity: 0.7
                    }),
                    zIndex: 0
                })
            ],
            visible: geoJsonLayer.visible
        })
    )

    getAttributions = (attributions) => {
        if (attributions) {
            return attributions.map(attr => (
                new ol.Attribution({
                    html: `<a href=${attr.url}>${attr.text}</a>`
                })
            ));
        } else {
            return null;
        }
    }

    /**
     * Sets the initial view based on the answers in the wizard screen
     */
    setMapSettings() {
        const laagNaam = Meteor.settings.public.laagNaam;
        const map = this.state.map;
        const layers = map.getLayers();

        const voorkeur = Session.get('pand');
        const huurKoop = Session.get('huur-koop');

        const selectedPlaats = Meteor.settings.public.gemeenteConfig.plaatsen.filter(plaats => 
            plaats.value === Session.get('plaats')
        )[0];

        // Zoom to the right place
        if (selectedPlaats) {
            map.setView(new ol.View({
                center: selectedPlaats.center,
                projection: 'EPSG:28992',
                zoom: selectedPlaats.zoom
            }));
        }

        // Set the visibility of the layers
        if(voorkeur === 'bestaand' || voorkeur === 'beide') {
            if(huurKoop === 'koop') {
                layers.forEach(layer => {
                    if(layer.get('title') === laagNaam.teKoop) {
                        layer.setVisible(true);
                    }
                });
            } else if(huurKoop === 'huur') {
                layers.forEach(layer => {
                    if(layer.get('title') === laagNaam.teHuur) {
                        layer.setVisible(true);
                    }
                });
            } else if(huurKoop === 'beide') {
                layers.forEach(layer => {
                    let title = layer.get('title');
                    if(title === laagNaam.teKoop || title === laagNaam.teHuur) {
                        layer.setVisible(true);
                    }
                });
            }
        }

        // Set the kavels layer visible
        if(voorkeur === 'nieuwbouw') {
            layers.forEach(layer => {
                if(layer.get('title') === laagNaam.kavels) {
                    layer.setVisible(true);
                }
            });
        }
    }

    setBackgroundLayer() {
        const map = this.state.map;
        const maxZoom = 16;
        const layers = map.getLayers();
        layers.forEach(layer => {
            if(layer.get('title') === 'BGT') {
                if(maxZoom <= map.getView().getZoom()) layer.setVisible(true);
                else layer.setVisible(false);
            }
            if(layer.get('title') === 'BRT') {
                if(maxZoom+1 >= map.getView().getZoom()) layer.setVisible(true);
                else layer.setVisible(false);
            } 
        });
    }

    /**
     * Add all kvk layers by SBI code
     */
    addKvkLayers = (layerConfig) => {
        Object.keys(layerConfig.icons).forEach(category => {
            const featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:28992',
                outputFormat: 'application/json',
                featurePrefix: layerConfig.featurePrefix,
                featureTypes: layerConfig.featureTypes,
                filter: ol.format.filter.equalTo('SBI_RUBR_C', category)
            });

            fetch(layerConfig.url, {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest)
            }).then(response => {
                return response.json();
            }).then(json => {
                const features = new ol.format.GeoJSON().readFeatures(json);
                const source = new ol.source.Vector();
                const layer = new ol.layer.Vector({
                    title: layerConfig.naam,
                    source: source,
                    style: [
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: layerConfig.icons[category],
                                imgSize: [48,48], // for IE11
                                scale: 0.5
                            }),
                            zIndex: 1
                        }),
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: layerConfig.iconShadow,
                                scale: 0.5,
                                opacity: 0.7
                            }),
                            zIndex: 0
                        })
                    ],
                    visible: false
                });
                source.addFeatures(features);
                this.state.map.addLayer(layer);
            });
        });
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

    updateLegenda = () => {
        this.forceUpdate();
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {

        return (
            <div id="map" className="map" >
                <SearchBar map={this.state.map} updateLegenda={this.updateLegenda} />
                <IconButton className='menu-button' style={{backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente}} onClick={this.openMenu} title='Menu' >
                    <img src={Meteor.settings.public.iconMenu} />
                </IconButton>
                <IconButton className='home-button' href='/' style={{backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente}} title='Home' >
                    <img src={Meteor.settings.public.iconHome} />
                </IconButton>
                <LayerMenu
                    map={this.state.map}
                    menuOpen={this.state.menuOpen}
                    closeMenu={this.closeMenu}
                    anchorEl={this.state.anchorEl} updateLegenda={this.updateLegenda}
                />
                <Legenda map={this.state.map} />
            </div>
        );
    }
}