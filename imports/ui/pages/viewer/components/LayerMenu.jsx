import React, { Component } from 'react';
import * as ol from 'openlayers';

import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import BedrijvenBranche from './MenuItems/BedrijvenBranche.jsx';
import OverigeLagen from './MenuItems/OverigeLagen.jsx';
import SearchBar from './MenuItems/SearchBar.jsx';

export default class LayerMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bedrijvenIndexAZOpen: false,
            searchFields: [],
            kvkVisible: false,
            updateKvk: false,
            menuOpen: this.props.menuOpen
        }

        this.fillSearchFields();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuOpen: nextProps.menuOpen,
            anchorEl: nextProps.anchorEl
        });
    }

    /**
     * Fills the search fields to search for KVK names
     */
    fillSearchFields() {
        console.log('Filling search fields...');

        let url = 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres_service/wfs?' +
        'service=wfs&version=1.1.0&request=GetFeature&outputFormat=application/json&resultType=results' +
        '&typeName=Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres_service:Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres&srs=EPSG:28992';

        Meteor.call('getSearchFields', url, (err, result) => {
            if(err) {
                console.log(err);
            }
            if(result !== null && result !== undefined) {
                this.state.searchFields = result;
                console.log('Search fields filled...');
            }
        });

    }

    /**
     * Sets the visibility of the KVK layer to the new value
     */
    setKvkVisible = (newVisible) => {
        this.setState({
            kvkVisible: newVisible
        });
    }

    updateKvkChecked = () => {
        this.setState({
            updateKvk: true
        });
    }

    /**
     * Finds the entered name in the features and zooms in to it if found
     */
    selectFeature = (searchfield) => {
        console.log('Searching for: ' + searchfield);
        
        // Center the map around the feature found
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index, arr) => {
            if(layer.get('title') === Meteor.settings.public.laagNaam.kvk) {
                console.log('Found layer Kvk Bedrijven...');

                // Set the layer visible
                /*layer.setVisible(true);
                this.setState({
                    kvkVisible: true
                });*/
                let newSearchField = true;
                
                layer.getSource().on('change', (e) => {
                    let source = e.target;
                    if(source.getState() === 'ready') {
                        let features = source.getFeatures();
                        for(let i = 0; i < features.length; i++) {
                            if(features[i].get('BEDR_NAAM') === searchfield && newSearchField) {
                                console.log(searchfield + ' found...');
                                newSearchField = false;

                                // Center around the coordinates of the found feature
                                let coords = features[i].getGeometry().getCoordinates();
                                this.props.map.getView().setCenter(coords[0]);

                                // Zoom to the feature found
                                this.props.map.getView().setZoom(17.5);

                                let select = new ol.interaction.Select({
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
                                });
                                this.props.map.addInteraction(select);
                                let collection = select.getFeatures().push(features[i]);
                            }
                        }
                    }
                });
                layer.getSource().dispatchEvent('change');
            }
        });
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        if(this.props.map !== null) {
            document.getElementById('map').focus();
        }

        return (
            <Popover
            open={this.props.menuOpen}
            anchorEl={this.props.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.props.closeMenu}
            animation={PopoverAnimationVertical}
            >
                <Menu>
                    <SearchBar dataSource={this.state.searchFields} onNewRequest={this.selectFeature} />
                    <OverigeLagen map={this.props.map} />
                </Menu>
            </Popover>
        );
    }
}