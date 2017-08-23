import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

export default class PopupBagWoonplaats extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Renders the popup for BAG Woonplaats features on the screen when clicked
     */
    render() {
        if(this.props.selectedFeature !== null) {
            let feature = this.props.selectedFeature;

            return (
                <div style={{position: 'absolute', top: (this.props.coords.y - 100), left: this.props.coords.x}}>
                    <Paper style={{width:285, height:300, borderRadius:5}} zDepth={5}>
                        <div style={{position:'relative', left:'20px'}}>
                            <br/>
                            <h3 style={{position:'relative'}}><u>BAG Woonplaats Info</u></h3><br/>
                            <b>Actualiteitsdatum:</b> {feature.get('actualiteitsdatum')}<br/>
                            <b>Identificatie:</b> {feature.get('identificatie')}<br/>
                            <b>Status:</b> {feature.get('status')}<br/>
                            <b>Woonplaats:</b>  {feature.get('woonplaats')}<br/><br/>
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