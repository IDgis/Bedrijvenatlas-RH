import React, { Component } from 'react';
import * as ol from 'openlayers';

import AutoComplete from 'material-ui/AutoComplete';


export default class SearchBar extends Component {

    state = {
        searchText: '',
        searchFields: [],
        listStyleWidth: '400px'
    }

    async componentDidMount() {
        const kvkBedrijven = Meteor.settings.public.kvkBedrijven;
        const detailHandel = Meteor.settings.public.detailHandel;

        const urlKvk = this.createGetFeatureUrl(kvkBedrijven);
        const urlDetailHandel = this.createGetFeatureUrl(detailHandel);

        const resultsKvk = await this.getMeteorCallAsync('getSearchFields', urlKvk);
        const resultsDetailHandel = await this.getMeteorCallAsync('getSearchFields', urlDetailHandel);
        const searchFields = [...resultsKvk, ...resultsDetailHandel].sort();

        this.setState({ searchFields });
    }

    createGetFeatureUrl = (featureObj) => (
        `${featureObj.url}?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json` +
            `&resultType=results&typeName=${featureObj.namespace}:${featureObj.featureTypes[0]}`
    )

    getMeteorCallAsync = (methodName, args) => {
        return new Promise((resolve, reject) => {
            Meteor.call(methodName, args, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    handleUpdateInput = (searchText) => {
        this.setState({ searchText });
    }

    selectFeature = (searchText) => {
        this.setState({ searchText: '' });

        // Look for the searched feature in the correct layer
        const { map, updateLegenda } = this.props;
        const { kvkBedrijven, detailHandel, gemeenteConfig } = Meteor.settings.public;
        const layers = map.getLayers();

        layers.forEach(layer => {
            if (layer.get('title') === kvkBedrijven.naam || layer.get('title') === detailHandel.naam) {
                const source = layer.getSource();
                if (source.getState() === 'ready' && source.getFeatures().length > 0) {
                    const features = source.getFeatures();

                    for (i in features) {
                        // Find the feature with the correct name
                        const search = features[i].get('BEDR_NAAM') + ' | ' + features[i].get('SBI_OMSCHR');
                        if (search === searchText) {
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
                                            src: gemeenteConfig.iconSelected,
                                            imgSize: [ 48, 48 ],
                                            scale: 0.5
                                        }),
                                        zIndex: 1
                                    }),
                                    new ol.style.Style({
                                        image: new ol.style.Icon({
                                            src: gemeenteConfig.iconShadow,
                                            imgSize: [ 48, 48 ],
                                            scale: 0.5
                                        }),
                                        zIndex: 0
                                    })
                                ]
                            });
                            map.addInteraction(select);
                            select.getFeatures().push(features[i]);

                            break;
                        }
                    }
                }
            }
        });

        updateLegenda();
    }

    flyTo = (location, done) => {
        const duration = 3000;
        const view = this.props.map.getView();
        const zoom = view.getZoom();
        let parts = 2;
        let called = false;

        function callback(complete) {
            --parts;
            if (called) {
                return;
            }
            if (parts === 0 || !complete) {
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
        const texts = searchText.split(' ');
        let inSearch = true;

        for (let i in texts) {
            inSearch = inSearch && ((key.toLowerCase()).indexOf(texts[i].toLowerCase()) !== -1);
        }

        return inSearch;
    }

    render() {
        return(
            <div className='searchbar' style={{backgroundColor: Meteor.settings.public.gemeenteConfig.colorGemeente}}>
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
