import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

export default class PopupIndustrie extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Renders the popup for industrie terreinen on the screen when clicked
     */
    render() {
        if(this.props.selectedFeature !== null) {
            let feature = this.props.selectedFeature;
            let link = (feature.get('KERN') === 'Holten' && feature.get('BEDRIJVENT').startsWith('Vletgaarsmaten')) 
                ? <a href='https://ondernemersloket.rijssen-holten.nl/home/publicatie/vletgaarsmaten-holten' target='_blank'><b>Gemeente Rijssen-Holten</b></a> 
                : '';

            return (
                <div style={{position: 'absolute', top: (this.props.coords.y - 100), left: this.props.coords.x}}>
                    <Paper style={{width:285, height:300, borderRadius:5}} zDepth={5}>
                        <div style={{position:'relative', left:'20px'}}>
                            <br/>
                            <h3><u>Bedrijventerreinen Info</u></h3><br/>
                            <b>Bedrijventerrein:</b> {feature.get('BEDRIJVENT')}<br/>
                            <b>Jaar:</b> {feature.get('JAAR')}<br/>
                            <b>Kern:</b> {feature.get('KERN')}<br/>
                            <b>Oppervlakte bruto:</b> {feature.get('OPPBRUTO')}<br/>
                            <b>Oppervlakte netto:</b> {feature.get('OPPNETTO')}<br/>
                            <b>Rinnummer:</b> {feature.get('RINNUMMER')}<br/><br/>

                            {link}
                        </div>
                    </Paper>
                </div>
            );
        }
        return (
            <div></div>
        );
    }
}