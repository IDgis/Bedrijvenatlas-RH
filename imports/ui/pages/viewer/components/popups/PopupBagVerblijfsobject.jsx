import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

export default class PopupBagVerblijfsobject extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Renders the popup for BAG Pand features on the screen when clicked
     */
    render() {
        if(this.props.selectedFeature !== null) {
            let feature = this.props.selectedFeature;

            return (
                <div style={{position: 'absolute', top: (this.props.coords.y - 100), left: this.props.coords.x}}>
                    <Paper style={{width:315, height:390, borderRadius:5}} zDepth={5}>
                        <div style={{position:'relative', left:'20px'}}>
                            <br/>
                            <h3 style={{position:'relative'}}><u>BAG Verblijfsobjecten Info</u></h3><br/>
                            <b>Actualiteitsdatum:</b> {feature.get('actualiteitsdatum')}<br/>
                            <b>Bouwjaar:</b> {feature.get('bouwjaar')}<br/>
                            <b>Gebruiksdoel:</b> {feature.get('gebruiksdoel')}<br/>
                            <b>Huisletter:</b> {feature.get('huisletter')}<br/>
                            <b>Huisnummer:</b> {feature.get('huisnummer')}<br/>
                            <b>Identificatie:</b> {feature.get('identificatie')}<br/>
                            <b>Openbare ruimte:</b> {feature.get('openbare_ruimte')}<br/>
                            <b>Oppervlakte:</b> {feature.get('oppervlakte')}<br/>
                            <b>Pandidentificatie:</b> {feature.get('pandidentificatie')}<br/>
                            <b>Pandstatus:</b> {feature.get('pandstatus')}<br/>
                            <b>Postcode:</b> {feature.get('postcode')}<br/>
                            <b>Status:</b> {feature.get('status')}<br/>
                            <b>Toevoeging:</b> {feature.get('toevoeging')}<br/>
                            <b>Woonplaats:</b> {feature.get('woonplaats')}<br/><br/>
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