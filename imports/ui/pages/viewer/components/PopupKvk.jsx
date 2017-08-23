import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

export default class PopupKvk extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Renders the popup for KVK Bedrijven features on the screen when clicked
     */
    render() {
        if(this.props.selectedFeature !== null) {
            let feature = this.props.selectedFeature;

            return (
                <div style={{position: 'absolute', top: (this.props.coords.y - 100), left: this.props.coords.x}}>
                    <Paper style={{width:360, height:350, borderRadius:5}} zDepth={5}>
                        <div style={{position:'relative', left:'20px'}}>
                            <br/>
                            <h3 style={{position:'relative', left:'100px'}}><u>KVK Info</u></h3><br/>
                            <b>KVK nummer:</b> {feature.get('KVK_NUMMER')}<br/>
                            <b>Handelsnaam:</b> {feature.get('KVK_HANDELSNAAM')}<br/>
                            <b>Straatnaam:</b> {feature.get('KVK_STRAATNAAM')}<br/>
                            <b>Huisnummer:</b> {feature.get('KVK_HUISNUMMER')}<br/>
                            <b>Toevoeging:</b> {feature.get('KVK_HUISTOEVOEGING')}<br/>
                            <b>Postcode:</b> {feature.get('KVK_POSTCODE')}<br/>
                            <b>Plaats:</b> {feature.get('KVK_WOONPLAATS')}<br/>
                            <b>Buurtnaam:</b> {feature.get('IMG_BUURTNAAM')}<br/>
                            <b>Telefoonnummer:</b> {feature.get('KVK_TELEFOONNUMMER')}<br/><br/>
                            <b>Omschrijving:</b> {feature.get('KVK_SBI_OMSCHRIJVING')}<br/><br/>
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