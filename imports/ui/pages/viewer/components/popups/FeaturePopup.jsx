import React, { Component } from 'react';
import * as ol from 'openlayers';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


export default class FeaturePopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fields: []
        }
    }

    componentDidMount() {
        this.getPopupFields();
    }

    getPopupFields = () => {
        const properties = this.props.feature.getProperties();
        const keys = Object.keys(properties);
        const fields = [];
        let count = 0;

        keys.forEach((key, index) => {
            if (typeof properties[key] !== 'object') {
                if (typeof properties[key] === 'string' && properties[key].indexOf('http') !== -1) {
                    fields.push(
                        <tr key={`field_${index}`}>
                            <td colSpan={2} style={{width:'450px', paddingBottom:'5px', paddingTop:'5px'}}>
                                <RaisedButton href={properties[key]} target='_blank' label={`Meer informatie (${key})`} />
                            </td>
                        </tr>
                    );
                } else {
                    fields.push(
                        <tr key={`property_${index}`}>
                            <td style={{width:'100px'}}><b>{key}:</b></td>
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

        return (
            <Paper style={{position:'absolute', width:width, top:'60px', left:left, borderRadius:5, zIndex:10, backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                <div style={{position:'relative', left:'20px'}}><br />
                    <h3><u>{this.props.layer.get('title')}</u></h3>
                    <table><tbody>{this.state.fields}</tbody></table>
                    <br />
                </div>
            </Paper>
        );
    }
}