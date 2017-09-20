import React, { Component } from 'react';
import * as ol from 'openlayers';

import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';

import BedrijvenBranche from './MenuItems/BedrijvenBranche.jsx';
import BedrijvenSorted from './MenuItems/BedrijvenSorted.jsx';
import OverigeLagen from './MenuItems/OverigeLagen.jsx';
import SearchBar from './MenuItems/SearchBar.jsx';
import Vastgoed from './MenuItems/Vastgoed.jsx';

export default class LayerMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bedrijvenIndexAZOpen: false,
            searchFields: [],
            kvkVisible: false,
            menuOpen: this.props.menuOpen
        }

        this.fillSearchFields();
        //this.fillSearchField();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuOpen: nextProps.menuOpen
        });
    }

    /**
     * Fills the search fields to search for KVK names
     */
    fillSearchFields() {
        console.log('Filling search fields...');
        let request = require('request');
        let url = 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres_service/wfs?' +
        'service=wfs&version=1.1.0&request=GetFeature&outputFormat=application/json&resultType=results' +
        '&typeName=Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres_service:Bedrijventerreinen_KVK_hoofdactiviteiten_per_adres&srs=EPSG:28992';

        request(url, (error, response, body) => {
            if(error) {
                console.log(error);
            }
            if(response.statusCode === 200) {
                let json = JSON.parse(body);
                let features = json['features'];
                for(let feature in features) {
                    let naam = features[feature]['properties']['BEDR_NAAM'];
                    this.state.searchFields.push(naam);
                }
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
                layer.setVisible(true);
                this.setState({
                    kvkVisible: true
                });
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

                                let select = new ol.interaction.Select();
                                this.props.map.addInteraction(select);
                                let collection = select.getFeatures().push(features[i]);

                                this.props.toggleMenuState(false);

                                // add a popup to for the feature found
                                /*this.props.map.getInteractions().forEach((val) => {
                                    if(val instanceof ol.interaction.Select) {
                                        let features = val.getFeatures();
                                        if(features.getArray().length > 0) {
                                            this.props.featurePopup(features.getArray()[0]);
                                        }
                                    }
                                });*/
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
        return (
            <Drawer open={this.state.menuOpen} /*openSecondary={true}*/ docked={false} onRequestChange={(open) => this.props.toggleMenuState(!this.state.menuOpen)} >
                <Menu>
                    <SearchBar dataSource={this.state.searchFields} onNewRequest={this.selectFeature} />
                    {/*<BedrijvenSorted selectFeature={this.selectFeature} />*/}
                    <BedrijvenBranche map={this.props.map} toggleMenuState={this.props.toggleMenuState} />
                    <OverigeLagen map={this.props.map} />
                    <Vastgoed map={this.props.map} />
                </Menu>
            </Drawer>
        );
    }
}