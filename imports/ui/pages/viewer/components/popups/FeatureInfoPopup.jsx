import React, { Component } from 'react';
import * as ol from 'openlayers';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default class FeatureInfoPopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            popup: null
        }
    }

    componentDidMount() {
        const resolution = this.props.map.getView().getResolution();
        const wmsSource = new ol.source.TileWMS({
            url: this.props.layerConfig.url,
            params: {
                'FORMAT': this.props.layerConfig.format,
                'LAYERS': this.props.layerConfig.layers,
                'CRS': 'EPSG:28992'
            }
        });
        const url = wmsSource.getGetFeatureInfoUrl(this.props.coords, resolution, 'EPSG:28992', {'INFO_FORMAT':'application/json'});

        Meteor.call('getFeatureInfo', url, (err, properties) => {
            if (err) {
                this.setState({
                    popup: <tr><td>{err.reason}</td></tr>
                });
            } else if (properties) {
                this.setState({popup: this.getPopupFields(properties)});
            } else {
                this.setState({popup: null});
            }
        });
    }

    getPopupFields = (properties) => {
        const keys = Object.keys(properties);
        const aliasKeys = Object.keys(Meteor.settings.public.aliassen);
        const fields = [];

        keys.forEach((key, index) => {
            const alias = this.getAlias(key, aliasKeys);
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

    getAlias = (key, aliasKeys) => {
        let alias = key;
        [...aliasKeys].forEach(aliasKey => {
            if (aliasKey === key) {
                alias = Meteor.settings.public.aliassen[key];
            }
        });

        return alias;
    }

    render() {
        const width = 500;
        const left = (window.innerWidth / 2) - (width / 2);

        if (this.state.popup) {
            return (
                <Paper className='valid' style={{position:'absolute', width:width, top:'60px', left:left, borderRadius:5, zIndex:10, backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                    <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{this.props.layerConfig.titel}</u></h3>
                        <table><tbody>{this.state.popup}</tbody></table> <br />
                        <br />
                    </div>
                </Paper>
            );
        } else {
            return(
                <Paper className='valid' style={{position:'absolute', width:width, top:'60px', left:left, borderRadius:5, zIndex:10, backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                    <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{this.props.layerConfig.titel}</u></h3>
                        <table><tbody><tr><td>Klik in een laag voor meer info...</td></tr></tbody></table> <br />
                        <br />
                    </div>
                </Paper>
            );
        }
    }
}