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
        Meteor.call('getKvkBedrijven', (error, result) => {
            let names = [];
            for(let i = 0; i < result.length; i++) {
                let res = result[i];
                names.push(res['KVK_HANDELSNAAM']);

                /*let straatnaam = res['KVK_STRAATNAAM'];
                let nameInArr = false;
                for(let j = 0; j < this.state.searchFields.length; j++) {
                    if(this.state.searchFields[j] === straatnaam) {
                        nameInArr = true;
                        break;
                    }
                }
                if(!nameInArr) {
                    this.state.searchFields.push(straatnaam);
                }*/
            }
            this.setState({
                searchFields: names
            });
            console.log('Search fields filled...');
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
                
                layer.getSource().on('change', (e) => {
                    let source = e.target;
                    if(source.getState() === 'ready') {
                        let features = source.getFeatures();
                        for(let i = 0; i < features.length; i++) {
                            if(features[i].get('KVK_HANDELSNAAM') === searchfield) {
                                console.log(searchfield + ' found...');

                                // Center around the coordinates of the found feature
                                let coords = features[i].getGeometry().getCoordinates();
                                this.props.map.getView().setCenter(coords);

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
     * Renders the object to the screen
     */
    render() {
        return (
            <Drawer open={this.state.menuOpen} /*openSecondary={true}*/ docked={false} onRequestChange={(open) => this.props.toggleMenuState(!this.state.menuOpen)} >
                <Menu>
                    <SearchBar dataSource={this.state.searchFields} onNewRequest={this.selectFeature} />
                    {/*<BedrijvenSorted selectFeature={this.selectFeature} />*/}
                    <BedrijvenBranche map={this.props.map} />
                    <OverigeLagen map={this.props.map} />
                    <Vastgoed map={this.props.map} />
                </Menu>
            </Drawer>
        );
    }
}