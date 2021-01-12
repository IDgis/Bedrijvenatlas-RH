import React from 'react';
import { Link } from 'react-router-dom';

import Map from 'ol/Map';
import View from 'ol/View';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import { equalTo } from 'ol/format/filter';
import GeoJSON from 'ol/format/GeoJSON';
import WFS from 'ol/format/WFS';
import { defaults as interactionDefaults } from 'ol/interaction';
import Select from 'ol/interaction/Select';
import Image from 'ol/layer/Image';
import Tile from 'ol/layer/Tile';
import lVector from 'ol/layer/Vector';
import { register } from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import ImageWMS from 'ol/source/ImageWMS';
import TileImage from 'ol/source/TileImage';
import TileWMS from 'ol/source/TileWMS';
import sVector from 'ol/source/Vector';
import sWMTS from 'ol/source/WMTS';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import TileGrid from 'ol/tilegrid/TileGrid';
import tWMTS from 'ol/tilegrid/WMTS';
import proj4 from 'proj4';

import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

import LayerMenu from '../menu/LayerMenu';
import Legenda from '../menu/Legenda';
import SearchBar from '../menu/SearchBar';

class Viewer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            map: null,
            menuOpen: false
        };

        proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        register(proj4);
    }

    /**
     * Sets up the initial OpenLayers map and layers
     */
    componentDidMount() {
        if (document.readyState === 'complete') {
            this.createMap();
        }

        document.onreadystatechange = () => {
            if (document.readyState === 'complete') {
                this.createMap();
            }
        }
    }

    createMap = () => {
        const {settings, mapToParent} = this.props;
        const map = new Map({
            target: 'map',
            layers: this.getMapLayers(settings),
            view: new View({
                center: settings.gemeenteConfig.center,
                projection: 'EPSG:28992',
                zoom: settings.gemeenteConfig.zoom,
                extent: settings.gemeenteConfig.extent,
                minZoom: settings.gemeenteConfig.minZoom,
                maxZoom: 21
            }),
            controls: [
                //new ScaleLine(),
                new Zoom(),
                new Attribution({
                    target: 'map',
                    className: 'attribution'
                })
            ],
            interactions: new interactionDefaults().extend([
                new Select({
                    style: [
                        new Style({
                            image: new Icon({
                                src: settings.gemeenteConfig.iconSelected,
                                imgSize: [ 48, 48 ], // for IE11
                                scale: 0.5
                            }),
                            zIndex: 1
                        }),
                        new Style({
                            image: new Icon({
                                src: settings.gemeenteConfig.iconShadow,
                                imgSize: [ 48, 48 ], // for IE11
                                scale: 0.5
                            }),
                            zIndex: 0
                        })
                    ]
                })
            ])
        });

        this.setState({map});
        this.setMapSettings(settings, map);
        this.setBackgroundLayer(map);
        this.addKvkLayers(settings.kvkBedrijven, map);
        this.addKvkLayers(settings.detailHandel, map);
        mapToParent(map);
    }

    /**
     * Returns all Layers to add to the Map
     */
    getMapLayers = (settings) => {
        const allLayers = [];

        const baseLayers = settings.baseLayers;
        const overlayLayers = settings.overlayLayers;
        const fundaLayers = settings.fundaLayers;

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
        const projection = new Projection({code: 'EPSG:28992', units: 'm', extent: extent});

        layers.forEach(layer => {
            const service = layer.service;

            if (service === 'tms') {
                allLayers.push(this.getTmsLayer(layer, extent, projection));
            } else if (service === 'wmts') {
                allLayers.push(this.getWmtsLayer(layer, projection));
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
        new Tile({
            title: tmsLayer.titel,
            preload: 1,
            source: new TileImage({
                crossOrigin: null,
                extent: extent,
                projection: projection,
                tileGrid: new TileGrid({
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
     */
    getWmtsLayer = (wmtsLayer, projection) => {
        const matrixIds = [];

        for (let i = 0; i < 16; i++) {
            matrixIds[i] = ((wmtsLayer.matrixSetPrefix || '') + i.toString());
        }

        return new Tile({
            title: wmtsLayer.titel,
            source: new sWMTS({
                attributions: this.getAttributions(wmtsLayer.attributions),
                url: wmtsLayer.url,
                layer: wmtsLayer.layer,
                matrixSet: wmtsLayer.matrixSet,
                format: wmtsLayer.format,
                projection: projection,
                style: wmtsLayer.style,
                tileGrid: new tWMTS({
                    origin: wmtsLayer.origin,
                    resolutions: wmtsLayer.resolutions,
                    matrixIds: matrixIds
                })
            }),
            visible: wmtsLayer.visible
        })
    };

    /**
     * Creates an OpenLayers WMS Layer
     * 
     * @param {Object} wmsLayer The WMS Layer object to convert to an OpenLayers Object
     */
    getWmsLayer = (wmsLayer) => (
        wmsLayer.tiling ?
        new Tile({
            title: wmsLayer.titel,
            source: new TileWMS({
                url: wmsLayer.url,
                params: {
                    'FORMAT': wmsLayer.format,
                    'LAYERS': wmsLayer.layers,
                    'CRS': 'EPSG:28992'
                }
            }),
            visible: wmsLayer.visible
        }) :
        new Image({
            title: wmsLayer.titel,
            source: new ImageWMS({
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
        new lVector({
            title: geoJsonLayer.titel,
            source: new sVector({
                url: geoJsonLayer.url,
                format: new GeoJSON()
            }),
            style: [
                new Style({
                    image: new Icon({
                        src: geoJsonLayer.icon,
                        imgSize: [ 48, 48 ], // for IE11
                        scale: 0.5
                    }),
                    zIndex: 1
                }),
                new Style({
                    image: new Icon({
                        src: geoJsonLayer.shadow,
                        imgSize: [ 48, 48 ], // for IE11
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
                new Attribution({
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
    setMapSettings(settings, map) {
        const layers = map.getLayers();
        const fundaLayers = settings.fundaLayers;
        const overlayLayers = settings.overlayLayers;

        const voorkeur = sessionStorage.getItem('pand');
        const huurKoop = sessionStorage.getItem('huur-koop');

        const selectedPlaats = settings.gemeenteConfig.plaatsen.filter(plaats => 
            plaats.value === sessionStorage.getItem('plaats')
        )[0];

        // Zoom to the right place
        if (selectedPlaats) {
            map.setView(new View({
                center: selectedPlaats.center,
                projection: 'EPSG:28992',
                zoom: selectedPlaats.zoom
            }));
        }

        // Set the visibility of the layers
        if(voorkeur === 'bestaand' || voorkeur === 'beide') {
            if(huurKoop === 'koop') {
                fundaLayers.forEach(fundaLayer => {
                    layers.forEach(layer => {
                        if (layer.get('title') === fundaLayer.titel && fundaLayer.type === 'koop') {
                            layer.setVisible(true);
                        }
                    });
                });
            } else if(huurKoop === 'huur') {
                fundaLayers.forEach(fundaLayer => {
                    layers.forEach(layer => {
                        if (layer.get('title') === fundaLayer.titel && fundaLayer.type === 'huur') {
                            layer.setVisible(true);
                        }
                    });
                });
            } else if(huurKoop === 'beide') {
                fundaLayers.forEach(fundaLayer => {
                    layers.forEach(layer => {
                        if (layer.get('title') === fundaLayer.titel) {
                            layer.setVisible(true);
                        }
                    });
                });
            }
        }

        // Set the kavels layer visible
        if(voorkeur === 'nieuwbouw') {
            overlayLayers.forEach(overlayLayer => {
                layers.forEach(layer => {
                    if (layer.get('title') === overlayLayer.titel && overlayLayer.type === 'nieuwbouw') {
                        layer.setVisible(true);
                    }
                });
            });
        }

        this.updateLegenda();
    }

    setBackgroundLayer(map) {
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
    addKvkLayers = (layerConfig, map) => {
        Object.keys(layerConfig.icons).forEach(category => {
            const filter = equalTo(layerConfig.filterColumn, category);
            const featureRequest = new WFS().writeGetFeature({
                srsName: 'EPSG:28992',
                outputFormat: 'application/json',
                featurePrefix: layerConfig.featurePrefix,
                featureTypes: layerConfig.featureTypes,
                filter: filter
            });

            fetch(layerConfig.url, {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest)
            }).then(response => {
                return response.json();
            }).then(json => {
                if (json.totalFeatures > 0) {
                    const features = new GeoJSON().readFeatures(json);
                    const source = new sVector();
                    const layer = new lVector({
                        title: layerConfig.naam,
                        source: source,
                        style: [
                            new Style({
                                image: new Icon({
                                    src: layerConfig.icons[category],
                                    imgSize: [48,48], // for IE11
                                    scale: 0.5
                                }),
                                zIndex: 1
                            }),
                            new Style({
                                image: new Icon({
                                    src: layerConfig.iconShadow,
                                    imgSize: [ 48, 48 ], // for IE11
                                    scale: 0.5,
                                    opacity: 0.7
                                }),
                                zIndex: 0
                            })
                        ],
                        visible: false
                    });
                    source.addFeatures(features);
                    map.addLayer(layer);
                }
            });
        });
    }

    /**
     * Toggles the state of the menu between open and closed
     */
    toggleMenu = (e) => {
        this.setState({
            menuOpen: !this.state.menuOpen
        });
    }

    updateLegenda = () => {
        this.forceUpdate();
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        const {settings} = this.props;
        const {map, menuOpen} = this.state;

        const menuButtonStyle = {
            backgroundColor: settings.gemeenteConfig.colorGemeente,
            border: '10px none',
            boxSizing: 'border-box',
            display: 'inline-block',
            fontFamily: 'Roboto, sans-serif',
            cursor: 'pointer',
            textDecoration: 'none',
            margin: '0px',
            padding: '12px',
            outline: 'currentcolor none medium',
            fontSize: '0px',
            fontWeight: 'inherit',
            position: 'relative',
            zIndex: '1',
            overflow: 'visible',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            width: '48px',
            height: '48px'
        };

        return (
            <div id="map" className="map" >
                <SearchBar settings={settings} map={map} updateLegenda={this.updateLegenda} />
                <button className='menu-button' title='Menu' style={menuButtonStyle} onClick={this.toggleMenu} >
                    <img src={settings.gemeenteConfig.iconMenu} alt="" />
                </button>
                <Link to='/'>
                    <IconButton className="home-button" style={{backgroundColor:settings.gemeenteConfig.colorGemeente, borderRadius:'5px'}} title="Home">
                        <HomeIcon style={{color:'white', width:'24px', height:'24px'}} />
                    </IconButton>
                </Link>
                {menuOpen && <LayerMenu
                    map={map}
                    updateLegenda={this.updateLegenda}
                    settings={settings}
                />}
                <Legenda settings={settings} map={map} />
            </div>
        );
    }
}

export default Viewer;
