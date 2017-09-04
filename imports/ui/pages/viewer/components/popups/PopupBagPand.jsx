import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

export default class PopupBagPand extends Component {

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
                    <Paper style={{width:285, height:300, borderRadius:5}} zDepth={5}>
                        <div style={{position:'relative', left:'20px'}}>
                            <br/>
                            <h3 style={{position:'relative', left:'40px'}}><u>BAG Pand Info</u></h3><br/>
                            <b>Aantal verblijfsobjecten:</b> {feature.get('aantal_verblijfsobjecten')}<br/>
                            <b>Actualiteitsdatum:</b> {feature.get('actualiteitsdatum')}<br/>
                            <b>Bouwjaar:</b> {feature.get('bouwjaar')}<br/>
                            <b>Identificatie:</b> {feature.get('identificatie')}<br/>
                            <b>Oppervlakte max:</b> {feature.get('oppervlakte_max')}<br/>
                            <b>Oppervlakte min:</b> {feature.get('oppervlakte_min')}<br/>
                            <b>Status:</b>  {feature.get('status')}<br/><br/>
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