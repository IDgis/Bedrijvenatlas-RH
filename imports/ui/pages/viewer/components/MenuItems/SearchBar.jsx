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
        const kvkBedrijven = Meteor.settings.public.kvkBedrijven;
        const url = `${kvkBedrijven.url}?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json` +
        `&resultType=results&typeName=${kvkBedrijven.namespace}:${kvkBedrijven.featureTypes[0]}`;

        Meteor.call('getSearchFields', url, (err, result) => {
            if(err) {
                console.log(err);
            }
            if(result !== null && result !== undefined) {
                this.state.searchFields = result;
                this.state.searchFields = this.state.searchFields.sort();
            }
        });
    }

    handleUpdateInput = (searchText) => {
        this.setState({searchText:searchText});
    }

    selectFeature = (searchText) => {
        this.setState({searchText:''});

        // Look for the searched feature in the correct layer
        const map = this.props.map;
        if(map !== null) {
            const layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === Meteor.settings.public.kvkBedrijven.naam) {
                    let newSearch = true;
                    const source = layer.getSource();
                    if(source.getState() === 'ready') {
                        const features = source.getFeatures();
                        for(i in features) {

                            // Find the feature with the correct name
                            const search = features[i].get('BEDR_NAAM') + ' | ' + features[i].get('SBI_OMSCHR');
                            if(search === searchText && newSearch) {
                                newSearch = false;

                                // Center around the coordinates of the found feature
                                // Also zoom in to the feature and set the layer visible
                                const coords = features[i].getGeometry().getCoordinates();

                                this.flyTo(coords[0], function(){});
                                layer.setVisible(true);

                                // Select the found feature
                                const select = new ol.interaction.Select({
                                    style: [
                                        new ol.style.Style({
                                            image: new ol.style.Icon({
                                                src: Meteor.settings.public.gemeenteConfig.iconSelected,
                                                imgSize: [ 48, 48 ], // for IE11
                                                scale: 0.5
                                            }),
                                            zIndex: 1
                                        }),
                                        new ol.style.Style({
                                            image: new ol.style.Icon({
                                                src: Meteor.settings.public.gemeenteConfig.iconShadow,
                                                imgSize: [ 48, 48 ], // for IE11
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
        this.props.updateLegenda();
    }

    flyTo = (location, done) => {
        let duration = 3000;
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
                    listStyle={{backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente, opacity:0.8, borderRadius:'5px', width:this.state.listStyleWidth}}
                />
            </div>
        );
    }
}