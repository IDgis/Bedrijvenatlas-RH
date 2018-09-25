import React, { Component } from 'react';
import * as ol from 'openlayers';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


export default class FeaturePopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fields: [],
            milieuCategorie: null
        }
    }

    componentDidMount() {
        this.getPopupFields();
        this.getMilieucategorie();
    }

    getPopupFields = () => {
        const properties = this.props.feature.getProperties();
        const keys = Object.keys(properties);
        const aliasKeys = Object.keys(Meteor.settings.public.aliassen);
        const fields = [];
        let count = 0;

        keys.forEach((key, index) => {
            const alias = this.getAlias(key, aliasKeys);
            if (typeof properties[key] !== 'object') {
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
                count++;
            }
        });

        fields.push(this.getBestemmingsplanButton(++count));
        fields.push(this.getStreetviewButton(++count));

        this.setState({fields});
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

    getMilieucategorie = () => {
        const categorieConfig = Meteor.settings.public.overlayLayers.filter(layer => layer.titel.toLowerCase().indexOf('milieu') !== -1)[0];
        const wmsSource = new ol.source.TileWMS({
            url: categorieConfig.url,
            params: {
                'FORMAT': categorieConfig.format,
                'LAYERS': categorieConfig.layers,
                'CRS': 'EPSG:28992'
            }
        });

        const resolution = this.props.map.getView().getResolution();
        const featureInfoUrl = wmsSource.getGetFeatureInfoUrl(this.props.coords, resolution, 'EPSG:28992', {'INFO_FORMAT':'application/json'});

        Meteor.call('getCategorieInfo', featureInfoUrl, (err, result) => {
            if (err) {
                console.log(err.reason);
                this.setState({milieuCategorie: null});
            } else if (result) {
                this.setState({
                    milieuCategorie: <tr key={'property_milieucat'}>
                            <td style={{width:'100px'}}><b>Categorie:</b></td>
                            <td style={{width:'350px'}}>{result}</td>
                        </tr>
                });
            }
        });
    }

    getBestemmingsplanButton = (index) => {
        const x = this.props.coords[0];
        const y = this.props.coords[1];
        const x_offset = 300;
        const y_offset = 150;

        const ruimtelijkeplannenUrl = `https://www.ruimtelijkeplannen.nl/web-roo/roo/bestemmingsplannen?` +
            `bbx1=${x - x_offset}&bby1=${y - y_offset}&bbx2=${x + x_offset}&bby2=${y + y_offset}`;

        return (
            <tr key={`field_${index}`}>
                <td colSpan={2} style={{width:'450px', paddingBottom:'5px', paddingTop:'5px'}}>
                    <RaisedButton href={ruimtelijkeplannenUrl} target='_blank' label='Bestemmingsplan' />
                </td>
            </tr>
        );
    }

    getStreetviewButton = (index) => (
        <tr key={`field_${index}`}>
            <td colSpan={2} style={{width:'450px', paddingBottom:'5px', paddingTop:'5px'}}>
                <RaisedButton label='Streetview' onClick={this.props.openStreetView} />
            </td>
        </tr>
    )

    getHorizontalPosition = (width) => {
        const offset = 20;
        const half = window.innerWidth / 2;
        const x = this.props.screenCoords[0];
        
        if (x < half) {
            return (x + offset);
        } else {
            return (x - (width + offset));
        }
    }

    render() {
        const width = 500;
        const left = this.getHorizontalPosition(width);
        let fields = this.state.fields;

        if (this.state.milieuCategorie) {
            fields = [];
            fields.push(this.state.milieuCategorie);
            fields = fields.concat(this.state.fields);
        }

        return (
            <Paper style={{position:'absolute', width:width, top:'60px', left:left, borderRadius:5, zIndex:10, backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                <div style={{position:'relative', left:'20px'}}><br />
                    <h3><u>{this.props.layer.get('title')}</u></h3>
                    <table><tbody>{fields}</tbody></table>
                    <br />
                </div>
            </Paper>
        );
    }
}