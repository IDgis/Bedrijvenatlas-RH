import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Select from 'ol/interaction/Select';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const SearchBar = ({ settings, map, updateLegenda }) => {

    const [options, setOptions] = useState([]);

    useEffect(() => {
        const createGetFeatureUrl = (featureObj) => (
            `${featureObj.url}?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json` +
            `&resultType=results&typeName=${featureObj.namespace}:${featureObj.featureTypes[0]}`
        );

        const initializetOptions = async (url, cancelTokenSource) => {
            const response = await axios.get(url, {
                cancelToken: cancelTokenSource.token
            });

            const searchFieds = [];
            const data = response.data;
            const features = data["features"];
            for (const feature in features) {
                const naam = features[feature]["properties"][settings.searchConfig.bedrijfsNaam];
                const oms = features[feature]["properties"][settings.searchConfig.sbiOmschrijving];
                searchFieds.push(naam + " | " + oms);
            }

            // Add new options
            setOptions(oldOptions => [...oldOptions, ...searchFieds].sort());
        };

        const cancelTokenSource = axios.CancelToken.source();
        const { kvkBedrijven, detailHandel } = settings;

        // Clear all previous options
        setOptions([]);

        if (Object.keys(kvkBedrijven.namen).length > 0) {
            const urlKvk = createGetFeatureUrl(kvkBedrijven);
            initializetOptions(urlKvk, cancelTokenSource);
        }

        if (Object.keys(detailHandel.namen).length > 0) {
            const urlDetailHandel = createGetFeatureUrl(detailHandel);
            initializetOptions(urlDetailHandel, cancelTokenSource);
        }

        return () => {
            cancelTokenSource.cancel();
        };
    }, [settings]);


    const onChange = (e) => {
        // Look for the searched feature in the correct layer
        const { kvkBedrijven, detailHandel, gemeenteConfig } = settings;
        const layers = map.getLayers();
        const searchText = e.target.textContent;

        layers.forEach(layer => {
            if (layer.get("title") === kvkBedrijven.naam || layer.get("title") === detailHandel.naam) {
                const source = layer.getSource();
                if (source.getState() === "ready" && source.getFeatures().length > 0) {
                    const features = source.getFeatures();

                    for (const feature of features) {
                        const search = feature.get("BEDR_NAAM") + " | " + feature.get("SBI_OMSCHR");
                        if (search === searchText) {
                            // Center around the coordinates of the found feature
                            // Also zoom in to the feature and set the layer visible
                            const coords = feature.getGeometry().getCoordinates();
                            flyTo(coords[0], function() {});
                            layer.setVisible(true);

                            // Select the found feature
                            const select = new Select({
                                style: [
                                    new Style({
                                        image: new Icon({
                                            src: gemeenteConfig.iconSelected,
                                            imgSize: [ 48, 48 ],
                                            scale: 0.5
                                        }),
                                        zIndex: 1
                                    }),
                                    new Style({
                                        image: new Icon({
                                            src: gemeenteConfig.iconShadow,
                                            imgSize: [ 48, 48 ],
                                            scale: 0.5
                                        }),
                                        zIndex: 0
                                    })
                                ]
                            });
                            map.addInteraction(select);
                            select.getFeatures().push(feature);

                            break;
                        }
                    }
                }
            }
        });

        updateLegenda();
    };

    const flyTo = (location, done) => {
        const duration = 3000;
        const view = map.getView();
        const zoom = view.getZoom();
        let parts = 2;
        let called = false;

        const callback = (complete) => {
            --parts;
            if (called) {
                return;
            }
            if (parts === 0 || !complete) {
                called = true;
                done(complete);
            }
        };

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
    };

    return (
        <div className='searchbar' style={{backgroundColor: settings.gemeenteConfig.colorGemeente}}>
            <Autocomplete
                className="auto-complete"
                clearOnEscape={true}
                handleHomeEndKeys={true}
                onChange={onChange}
                options={options}
                renderInput={ (params) => <TextField { ...params } label="Zoek bedrijf" variant="outlined" /> }
            />
        </div>
    );
};

export default SearchBar;
