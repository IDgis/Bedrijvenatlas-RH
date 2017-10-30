import React, { Component } from 'react';
import * as ol from 'openlayers';

import AutoComplete from 'material-ui/AutoComplete';


export default class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchFields: [],
            listStyleWidth: '400px'
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
                            let search = features[i].get('BEDR_NAAM') + ' | ' + features[i].get('SBI_OMSCHR');
                            if(search === searchText && newSearch) {
                                console.log(searchText + ' found...');
                                newSearch = false;

                                // Center around the coordinates of the found feature
                                // Also zoom in to the feature and set the layer visible
                                let coords = features[i].getGeometry().getCoordinates();

                                this.flyTo(coords[0], function(){});
                                /*map.getView().setCenter(coords[0]);
                                map.getView().setZoom(17.5);*/
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

    flyTo = (location, done) => {
        console.log(location);
        let duration = 2000;
        let view = this.props.map.getView();
        let zoom = view.getZoom();
        let parts = 2;
        let called = false;
        function callback(complete) {
            --parts;
            if(called) {
                return;
            }
            if(parts === 0 || !complete) {
                called = true;
                done(complete);
            }
        }
        view.animate({
            center: location,
            duration: duration
        }, callback);
        view.animate({
            zoom: zoom - 2,
            duration: duration / 2
        }, {
            zoom: 17.5,
            duration: duration / 2
        }, callback);
    }

    filterResults = (searchText, key) => {
        let texts = searchText.split(' ');
        let inSearch = true;
        
        for(let i in texts) {
            inSearch = inSearch && ((key.toLowerCase()).indexOf(texts[i].toLowerCase()) !== -1);
        }

        return inSearch;
    }

    render() {


        return(
            <div className='searchbar' >
                <AutoComplete 
                    className='auto-complete'
                    floatingLabelText="Zoek bedrijf"
                    dataSource={this.state.searchFields}
                    filter={this.filterResults}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    maxSearchResults={10}
                    searchText={this.state.searchText}
                    onUpdateInput={this.handleUpdateInput}
                    onNewRequest={this.selectFeature}
                    listStyle={{backgroundColor:'rgb(115,0,73)', opacity:0.8, borderRadius:'5px', width:this.state.listStyleWidth}}
                />
            </div>
        );
    }
}