import React from 'react';

import * as ol from 'openlayers';
import AutoComplete from 'material-ui/AutoComplete';
import axios from 'axios';

class SearchBar extends React.Component {

    state = {
        searchText: '',
        searchFields: [],
        listStyleWidth: '400px'
    };

    async componentDidMount() {
        const {settings} = this.props;
        const kvkBedrijven = settings.kvkBedrijven;
        const detailHandel = settings.detailHandel;

        let resultsKvk = [];
        let resultsDetailHandel = [];

        if (Object.keys(kvkBedrijven.namen).length > 0) {
            const urlKvk = this.createGetFeatureUrl(kvkBedrijven);
            resultsKvk = await this.getSearchFields(urlKvk);
        }

        if (Object.keys(detailHandel.namen).length > 0) {
            const urlDetailHandel = this.createGetFeatureUrl(detailHandel);
            resultsDetailHandel = await this.getSearchFields(urlDetailHandel);
        }
        
        const searchFields = [...resultsKvk, ...resultsDetailHandel].sort();

        this.setState({ searchFields });
    }

    createGetFeatureUrl = (featureObj) => (
        `${featureObj.url}?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json` +
            `&resultType=results&typeName=${featureObj.namespace}:${featureObj.featureTypes[0]}`
    )

    getSearchFields = (url) => {
        const { settings } = this.props;
        return axios.get(url).then(response => {
            const searchFields = [];
            const data = response.data;
            const features = data['features'];
            for (let feature in features) {
                const naam = features[feature]['properties'][settings.searchConfig.bedrijfsNaam];
                const oms = features[feature]['properties'][settings.searchConfig.sbiOmschrijving];
                searchFields.push(naam + ' | ' + oms);
            }

            return searchFields;
        });
    }

    handleUpdateInput = (searchText) => {
        this.setState({ searchText });
    }

    selectFeature = (searchText) => {
        this.setState({ searchText: '' });

        // Look for the searched feature in the correct layer
        const { map, updateLegenda, settings } = this.props;
        const { kvkBedrijven, detailHandel, gemeenteConfig } = settings;
        const layers = map.getLayers();

        layers.forEach(layer => {
            if (layer.get('title') === kvkBedrijven.naam || layer.get('title') === detailHandel.naam) {
                const source = layer.getSource();
                if (source.getState() === 'ready' && source.getFeatures().length > 0) {
                    const features = source.getFeatures();

                    for (let i in features) {
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
        const {map} = this.props;
        const duration = 3000;
        const view = map.getView();
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
        const {settings} = this.props;
        const {searchFields, searchText, listStyleWidth} = this.state;
        return(
            <div className='searchbar' style={{backgroundColor: settings.gemeenteConfig.colorGemeente}}>
                <AutoComplete 
                    className='auto-complete'
                    floatingLabelText="Zoek bedrijf"
                    dataSource={searchFields}
                    filter={this.filterResults}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    maxSearchResults={10}
                    searchText={searchText}
                    onUpdateInput={this.handleUpdateInput}
                    onNewRequest={this.selectFeature}
                    listStyle={{backgroundColor:settings.gemeenteConfig.colorGemeente, opacity:0.8, borderRadius:'5px', width:listStyleWidth}}
                />
            </div>
        );
    }
}

export default SearchBar;
