import React, { Component } from 'react';
import * as ol from 'openlayers';

import AutoComplete from 'material-ui/AutoComplete';


const style = {
    position: 'fixed',
    backgroundColor: 'white',
    height: '86px',
    zIndex: 1,
    top: '66px',
    left: '10px'
}

export default class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchFields: []
        };

        this.fillSearchFields();
    }

    fillSearchFields = () => {
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
                this.state.searchFields = this.state.searchFields.sort();
                console.log('Search fields filled...');
            }
        });
    }

    handleUpdateInput = (searchText) => {
        this.setState({searchText:searchText});
    }

    selectFeature = (searchText) => {
        this.setState({searchText:''});
        console.log('Searching for: ' + searchText);

        // Look for the searched feature in the correct layer
        let map = this.props.map;
        if(map !== null) {
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === Meteor.settings.public.laagNaam.kvk) {
                    let newSearch = true;
                    let source = layer.getSource();
                    if(source.getState() === 'ready') {
                        let features = source.getFeatures();
                        for(i in features) {

                            // Find the feature with the correct name
                            if(features[i].get('BEDR_NAAM') === searchText && newSearch) {
                                console.log(searchText + ' found...');
                                newSearch = false;

                                // Center around the coordinates of the found feature
                                // Also zoom in to the feature and set the layer visible
                                let coords = features[i].getGeometry().getCoordinates();
                                map.getView().setCenter(coords[0]);
                                map.getView().setZoom(17.5);
                                layer.setVisible(true);

                                // Select the found feature
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
                                map.addInteraction(select);
                                select.getFeatures().push(features[i]);
                            }
                        }
                    }
                }
            });
        }
    }

    render() {
        return(
            <div style={style} >
                <AutoComplete 
                    floatingLabelText="Zoek bedrijf"
                    dataSource={this.state.searchFields}
                    filter={AutoComplete.caseInsensitiveFilter}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    maxSearchResults={20}
                    searchText={this.state.searchText}
                    onUpdateInput={this.handleUpdateInput}
                    onNewRequest={this.selectFeature}
                />
            </div>
        );
    }
}