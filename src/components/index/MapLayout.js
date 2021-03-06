import React from 'react';
import { register } from 'ol/proj/proj4';
import { transform } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';
import proj4 from 'proj4';
import axios from 'axios';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import FeatureInfoPopup from '../popup/FeatureInfoPopup';
import FeaturePopup from '../popup/FeaturePopup';
import StreetView from '../streetview/StreetView';
import Viewer from '../viewer/Viewer';

const style = {
    position: 'absolute',
    bottom: '0px',
    top: '56px',
    width: '100%'
};

const theme = createMuiTheme({
    overrides: {
        MuiOutlinedInput: {
            notchedOutline: {
                borderColor: 'rgb(224, 224, 224)'
            }
        },
        MuiAutocomplete: {
            root: {
                height: '65px !important',
                marginTop: '12px',
                paddingRight: '10px'
            }
        },
        MuiFormLabel: {
            root: {
                '&$focused': {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        },
        MuiInputLabel: {
            root: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '700',
                fontSize: '14px',
                lineHeight: '22px'
            }
        },
        MuiInputBase: {
            root: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px'
            }
        },
        MuiSvgIcon: {
            root: {
                color: 'rgba(255, 255, 255, 0.8)'
            }
        }
    }
});

class MapLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false,
            featurePopup: <div></div>,
            streetView: <div></div>
        };

        this.location = [0,0];
    }

    /**
     * Sets the map variable to the state so it can be passed to other components
     */
    setMap = (map) => {
        if (map) {
            this.handleResolutionChange(map);
            this.handleMapClick(map);
        }
    };

    /**
     * Listen for zoom events on the map and select different background layers
     */
    handleResolutionChange = (map) => {
        map.getView().on('change:resolution', () => {
            const mapToggleZoom = 16;
            map.getLayers().forEach(layer => {
                if (layer.get('title') === 'BGT') {
                    layer.setVisible(mapToggleZoom <= map.getView().getZoom());
                }
                if (layer.get('title') === 'BRT') {
                    layer.setVisible(mapToggleZoom + 1 >= map.getView().getZoom());
                }
            })
        });
    }

    /**
     * Listen for click events on the map and creates a popup for the selected features.
     */
    handleMapClick = (map) => {
        const { settings } = this.props;
        map.on('click', async (e) => {
            this.location = [e.coordinate[0], e.coordinate[1]];

            // For GetFeatureInfo request
            let popup = this.getFeatureInfoPopup(map); // TODO: aanpassen?

            // Check if the user clicked on a feature (from WFS / GeoJSON)
            // For GetFeature request
            await map.forEachFeatureAtPixel(e.pixel, async (feature, layer) => {
                const title = layer.get('title');
                const fundaLayerNames = settings.fundaLayers.map(fundaLayer => fundaLayer.titel);
                const layerNames = [...fundaLayerNames, settings.kvkBedrijven.naam, settings.detailHandel.naam];
                const milieuCategorie = await this.getMilieucategorie(map, settings, this.location);

                layerNames.forEach(name => {
                    if (title === name) {
                        popup = <FeaturePopup 
                                    map={map}
                                    settings={settings}
                                    feature={feature}
                                    layer={layer}
                                    coords={this.location}
                                    milieuCategorie={milieuCategorie}
                                    screenCoords={e.pixel}
                                    openStreetView={this.openStreetView}
                                    onRequestClose={this.closePopup}
                                    />
                    }
                });
            });

            this.setState({
                featurePopup: popup
            });
        });
    }

    getMilieucategorie = async (map, settings, coords) => {
        const categorieConfig = settings.overlayLayers.filter(layer => layer.titel.toLowerCase().indexOf('milieu') !== -1)[0];
        const wmsSource = new TileWMS({
            url: categorieConfig.url,
            params: {
                'FORMAT': categorieConfig.format,
                'LAYERS': categorieConfig.layers,
                'CRS': 'EPSG:28992'
            }
        });

        const resolution = map.getView().getResolution();
        const featureInfoUrl = wmsSource.getGetFeatureInfoUrl(coords, resolution, 'EPSG:28992', {'INFO_FORMAT':'application/json'});
        const response = await axios.get(featureInfoUrl);
        const feature = response.data.features[0];

        if (feature !== undefined) {
            return feature.properties[settings.searchConfig.milieuCategorie];
        } else {
            return null;
        }
    }

    getFeatureInfoPopup = (map) => {
        const { settings } = this.props;
        let popup = <div></div>;

        map.getLayers().forEach(layer => {
            if (layer.getVisible()) {
                const title = layer.get('title');
                settings.overlayLayers.forEach(overlayLayer => {
                    if (title === overlayLayer.titel && overlayLayer.service === 'wms' && overlayLayer.showFeatureInfo) {
                        popup = <FeatureInfoPopup settings={settings} coords={this.location} map={map} layer={layer} layerConfig={overlayLayer} onRequestClose={this.closePopup} />;
                    }
                });
            }
        });

        return popup;
    }

    /**
     * Checks whether the menu is open or closed and passes its value to the state so the menu can be rendered
     */
    toggleMenuState = (newState) => {
        this.setState({
            menuOpen: newState
        });
    }

    /**
     * Opens streetview in the bottom right of the screen
     */
    openStreetView = (event) => {
        proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        register(proj4);
        let coord = transform([this.location[0],this.location[1]],'EPSG:28992','EPSG:4326');

        this.setState({
            streetView: <StreetView coords={coord} close={this.closeStreetView} />
        });
    }

    /**
     * Closes the streetview component
     */
    closeStreetView = (event) => {
        this.setState({
            streetView: <div></div>
        });
    }

    /**
     * Closes the popup component
     */
    closePopup = (event) => {
        this.setState({
            featurePopup: <div></div>
        });
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        register(proj4);
        const {settings} = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <main style={style}>
                    {<Viewer settings={settings} mapToParent={this.setMap} featurePopup={this.setKvkPopup} />}
                    {this.state.featurePopup}
                    {this.state.streetView}
                </main>
            </MuiThemeProvider>
        );
    }
}

export default MapLayout;
