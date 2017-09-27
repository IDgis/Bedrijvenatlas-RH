import React, { Component } from 'react';
import * as ol from 'openlayers';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default class Popup extends Component {

    constructor(props) {
        super(props);
    }

    getCategorieInfo = () => {
        let title = this.props.title;
        let that = this;
        let laagNaam = Meteor.settings.public.laagNaam;
        if(title === laagNaam.kvk || title === laagNaam.teKoop || title === laagNaam.teHuur) {
            let map = this.props.map;
            let view = map.getView();
            let viewResolution = view.getResolution();
            let coords = this.props.selectedFeature.getGeometry().getCoordinates()[0];
            let wmsSource = new ol.source.TileWMS({
                url: 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_RO_categorie_indeling_service/ows?SERVICE=WMS&',
                params: {
                    'FORMAT': 'image/png',
                    'LAYERS': 'Bedrijventerreinen_RO_categorie_indeling',
                    'CRS': 'EPSG:28992'
                }
            });
            let url = wmsSource.getGetFeatureInfoUrl(coords, viewResolution, 'EPSG:28992',{'INFO_FORMAT':'application/json'});

            Meteor.call('getFeatureInfo', url, (err, result) => {
                if(err) {
                    console.log(err);
                    return '';
                }
                if(result !== null || result !== undefined) {
                    console.log(result);
                    return result;
                }
            });
        }
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        let laagNaam = Meteor.settings.public.laagNaam;
        let title = this.props.title;
        let searchFields = this.props.searchFields;

        let link = (title === laagNaam.ibis && this.props.selectedFeature.get('BEDR_TERR').startsWith('Vletgaarsmaten'))
            ? <div><br /><RaisedButton href={'https://ondernemersloket.rijssen-holten.nl/home/publicatie/vletgaarsmaten-holten'} target='_blank' label='Gemeente Rijssen-Holten' /><br /></div>
            : <div></div>;
        let fundalink = (title === laagNaam.teKoop || title === laagNaam.teHuur)
            ? <div><br /><RaisedButton href={this.props.selectedFeature.get('URL')} target='_blank' label='Funda' /><br /></div>
            : <div></div>
        let streetviewbutton = (title === laagNaam.teKoop || title === laagNaam.teHuur || title === laagNaam.kvk)
            ? <div><br /><RaisedButton label='Streetview' onClick={this.props.openStreetView} /><br /></div>
            : <div></div>;
        let location = this.props.map.getView().calculateExtent(this.props.map.getSize());
        let ruimtelijkePlannenUrl = 'http://www.ruimtelijkeplannen.nl/web-roo/roo/bestemmingsplannen?' +
            'bbx1=' + location[0] + '&bby1=' + location[1] + '&bbx2=' + location[2] + '&bby2=' + location[3];

        let returnField = [];
        for(let i in searchFields) {
            let result = <div key={i}><b>{searchFields[i]}:</b> {this.props.selectedFeature.get(searchFields[i])}<br /></div>;
            returnField.push(result);
        }

        //let categorieInfo = <div><b>CATEGORIE:</b> {this.getCategorieInfo()}</div>;

        return(
            <div style={{position: 'absolute', top: (this.props.coords.y - 100), left: this.props.coords.x}}>
                <Paper style={{width:350, borderRadius:5}} zDepth={5} >
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{this.props.title}</u></h3>
                        {returnField} <br />
                        <RaisedButton href={ruimtelijkePlannenUrl} target='_blank' label='Bestemmingsplan' /><br />
                        {link}
                        {fundalink}
                        {streetviewbutton}
                        <br />
                    </div>
                </Paper>
            </div>
        );
    }
}