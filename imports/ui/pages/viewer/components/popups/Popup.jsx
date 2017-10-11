import React, { Component } from 'react';
import * as ol from 'openlayers';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default class Popup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            screenCoords: [],
            gemeenteLink: this.getGemeenteLink(props),
            fundaLink: this.getFundaLink(props),
            streetviewButton: this.getStreetviewButton(props),
            bestemmingsplanButton: this.getBestemmingsplanButton(props),
            milieuCategorie: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            screenCoords: nextProps.screenCoords
        });
    }

    componentDidMount = () => {
        let title = this.props.title;
        let that = this;
        let laagNaam = Meteor.settings.public.laagNaam;
        if(title === laagNaam.kvk || title === laagNaam.teKoop || title === laagNaam.teHuur) {
            let map = this.props.map;
            let view = map.getView();
            let viewResolution = view.getResolution();
            let coords = [];

            if(title === laagNaam.kvk) {
                coords = this.props.selectedFeature.getGeometry().getCoordinates()[0];
            } else {
                coords = this.props.selectedFeature.getGeometry().getCoordinates();
            }
            
            let wmsSource = new ol.source.TileWMS({
                url: 'https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_RO_categorie_indeling_service/ows?SERVICE=WMS&',
                params: {
                    'FORMAT': 'image/png',
                    'LAYERS': 'Bedrijventerreinen_RO_categorie_indeling',
                    'CRS': 'EPSG:28992'
                }
            });
            let url = wmsSource.getGetFeatureInfoUrl(coords, viewResolution, 'EPSG:28992',{'INFO_FORMAT':'application/json'});

            Meteor.call('getCategorieInfo', url, (err, result) => {
                if(err) {
                    console.log(err);
                    this.setState({milieuCategorie: ''});
                }
                if(result !== null || result !== undefined) {
                    this.setState({milieuCategorie: result});
                }
            });
        }
    }

    getGemeenteLink = (props) =>{
        const laagNaam = Meteor.settings.public.laagNaam;
        if(props.title === laagNaam.kavels) {
            return <div><br /><RaisedButton href={'https://ondernemersloket.rijssen-holten.nl/home/publicatie/vletgaarsmaten-holten'} target='_blank' label='Gemeente Rijssen-Holten' /><br /></div>;
        } else {
            return <div></div>;
        }
    }

    getFundaLink = (props) => {
        const laagNaam = Meteor.settings.public.laagNaam;
        if(props.title === laagNaam.teKoop || props.title === laagNaam.teHuur) {
            return <div><br /><RaisedButton href={props.selectedFeature.get('URL')} target='_blank' label='Makelaar' /><br /></div>
        } else {
            return <div></div>;
        }
    }

    getStreetviewButton = (props) => {
        const laagNaam = Meteor.settings.public.laagNaam;
        if(props.title === laagNaam.teKoop || props.title === laagNaam.teHuur || props.title === laagNaam.kvk) {
            return <div><br /><RaisedButton label='Streetview' onClick={props.openStreetView} /><br /></div>;
        } else {
            return <div></div>;
        }
    }

    getBestemmingsplanButton = (props) => {
        const x = props.coords[0];
        const y = props.coords[1];
        const x_offset = 300;
        const y_offset = 150;
        const ruimtelijkePlannenUrl = 'http://www.ruimtelijkeplannen.nl/web-roo/roo/bestemmingsplannen?' +
            'bbx1=' + (x-x_offset) + '&bby1=' + (y-y_offset) + '&bbx2=' + (x+x_offset) + '&bby2=' + (y+y_offset);
        return <div><RaisedButton href={ruimtelijkePlannenUrl} target='_blank' label='Bestemmingsplan' /><br /></div>;
    }

    getPopupFields = (searchFields, selectedFeature) => {
        let returnFields = [];
        let res = [];
        for(let i in searchFields) {
            let top = (i*25+70)
            let searchField = searchFields[i];
            let alias = Meteor.settings.public.alias[searchField];
            let oms = (alias !== undefined) ? alias : searchField;

            res.push(
                <tr key={i}>
                    <td style={{width:'100px'}} ><b>{oms}:</b></td>
                    <td style={{width:'350px'}} >{selectedFeature.get(searchField)}</td>
                </tr>
            );

        }

        return res;
    }

    getHorizontalPosition = (width) => {
        const offset = 20;
        const half = window.innerWidth/2;
        const x = this.props.screenCoords[0];
        if(x < half) {
            return (x + offset);
        } else {
            return (x - (width + offset));
        }

        return (window.innerWidth/2-100);
    }

    render() {
        const laagNaam = Meteor.settings.public.laagNaam;
        const title = this.props.title;
        const searchFields = this.props.searchFields;

        const returnField = this.getPopupFields(searchFields, this.props.selectedFeature);
        
        const width = 500;
        const left = this.getHorizontalPosition(width);

        if(this.state.milieuCategorie !== '' && this.state.milieuCategorie !== null && (title === laagNaam.kvk || title === laagNaam.teKoop || title === laagNaam.teHuur)) {
            returnField.push(
                <tr key={returnField.length}>
                    <td style={{width:'100px'}} ><b>Categorie:</b></td>
                    <td style={{width:'350px'}} >{this.state.milieuCategorie}</td>
                </tr>
            );

            return(
                <Paper style={{position:'absolute', width:width, top:'20px', left:left, borderRadius:5, backgroundColor:Meteor.settings.public.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                    <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{this.props.title}</u></h3>
                        <table><tbody>{returnField}</tbody></table> <br />
                        {this.state.bestemmingsplanButton}
                        {this.state.gemeenteLink}
                        {this.state.fundaLink}
                        {this.state.streetviewButton}
                        <br />
                    </div>
                </Paper>
            );
        }
        
        return(
            <Paper style={{position:'absolute', width:width, top:'20px', left:left, borderRadius:5, backgroundColor:Meteor.settings.public.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                <div style={{position:'relative', left:'20px'}}><br />
                    <h3><u>{this.props.title}</u></h3>
                    <table><tbody>{returnField}</tbody></table> <br />
                    {this.state.bestemmingsplanButton}
                    {this.state.gemeenteLink}
                    {this.state.fundaLink}
                    {this.state.streetviewButton}
                    <br />
                </div>
            </Paper>
        );
    }
}