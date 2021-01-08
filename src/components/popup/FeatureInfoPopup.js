import React from 'react';
import TileWMS from 'ol/source/TileWMS';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

class FeatureInfoPopup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            popup: null
        }
    }

    async componentDidMount() {
        const { map, layerConfig, coords } = this.props;
        const resolution = map.getView().getResolution();
        const wmsSource = new TileWMS({
            url: layerConfig.url,
            params: {
                'FORMAT': layerConfig.format,
                'LAYERS': layerConfig.layers,
                'CRS': 'EPSG:28992'
            }
        });
        const url = wmsSource.getGetFeatureInfoUrl(coords, resolution, 'EPSG:28992', {'INFO_FORMAT':'application/json'});
        const properties = await this.getFeatureInfo(url);

        if (properties) {
            this.setState({popup: this.getPopupFields(properties)});
        } else {
            this.setState({popup: null});
        }
    }

    getFeatureInfo = (url) => {
        return axios.get(url).then(response => {
            const data = response.data;
            const features = data.features;

            if (features.length > 0) {
                const feature = features[0];

                return feature.properties;
            } else {
                return null;
            }
        });
    }

    getPopupFields = (properties) => {
        const { settings } = this.props;
        const keys = Object.keys(properties);
        const aliasKeys = Object.keys(settings.aliassen);
        const fields = [];

        keys.forEach((key, index) => {
            const alias = this.getAlias(key, aliasKeys, settings);
            if (typeof properties[key] === 'string' && properties[key].indexOf('http') !== -1) {
                fields.push(
                    <tr key={`field_${index}`}>
                        <td colSpan={2} style={{width:'450px', paddingBottom:'5px', paddingTop:'5px'}}>
                            <RaisedButton href={properties[key]} target='_blank' label={`Meer informatie (${alias})`} />
                        </td>
                    </tr>
                );
            } else {
                fields.push(
                    <tr key={`property_${index}`}>
                        <td style={{width:'100px'}}><b>{alias}:</b></td>
                        <td style={{width:'350px'}}>{properties[key]}</td>
                    </tr>
                );
            }
        });

        return fields;
    }

    getAlias = (key, aliasKeys, settings) => {
        let alias = key;
        [...aliasKeys].forEach(aliasKey => {
            if (aliasKey === key) {
                alias = settings.aliassen[key];
            }
        });

        return alias;
    }

    render() {
        const { settings, onRequestClose, layerConfig } = this.props;
        const { popup } = this.state;
        const width = 500;
        const left = (window.innerWidth / 2) - (width / 2);

        if (popup) {
            return (
                <Paper className='valid' style={{position:'absolute', width:width, top:'60px', left:left, borderRadius:5, zIndex:10, backgroundColor:settings.gemeenteConfig.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                    <RaisedButton className='popup-close-button' label='X' onClick={onRequestClose} />
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{layerConfig.titel}</u></h3>
                        <table><tbody>{popup}</tbody></table> <br />
                        <br />
                    </div>
                </Paper>
            );
        } else {
            return(
                <Paper className='valid' style={{position:'absolute', width:width, top:'60px', left:left, borderRadius:5, zIndex:10, backgroundColor:settings.gemeenteConfig.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                    <RaisedButton className='popup-close-button' label='X' onClick={onRequestClose} />
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{layerConfig.titel}</u></h3>
                        <table><tbody><tr><td>Klik in een laag voor meer info...</td></tr></tbody></table> <br />
                        <br />
                    </div>
                </Paper>
            );
        }
    }
}

export default FeatureInfoPopup;
