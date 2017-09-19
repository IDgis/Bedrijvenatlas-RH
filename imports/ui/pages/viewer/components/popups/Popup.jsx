import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

export default class Popup extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let searchFields = this.props.searchFields;
        let returnField = [];
        let link = (this.props.title === Meteor.settings.public.laagNaam.ibis && this.props.selectedFeature.get('BEDRIJVENT').startsWith('Vletgaarsmaten'))
            ? <div><br /><a href='https://ondernemersloket.rijssen-holten.nl/home/publicatie/vletgaarsmaten-holten' target='_blank'><b>Gemeente Rijssen-Holten</b></a><br /></div>
            : <div></div>;
        let location = this.props.map.getView().calculateExtent(this.props.map.getSize());
        let ruimtelijkePlannenUrl = 'http://www.ruimtelijkeplannen.nl/web-roo/roo/bestemmingsplannen?' +
            'bbx1=' + location[0] + '&bby1=' + location[1] + '&bbx2=' + location[2] + '&bby2=' + location[3];

        for(let i in searchFields) {
            let result = <div key={i}><b>{searchFields[i]}:</b> {this.props.selectedFeature.get(searchFields[i])}<br /></div>;
            returnField.push(result);
        }

        return(
            <div style={{position: 'absolute', top: (this.props.coords.y - 100), left: this.props.coords.x}}>
                <Paper style={{width:285, /*height:300,*/ borderRadius:5}} zDepth={5} >
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{this.props.title}</u></h3>
                        {returnField} <br />
                        <a href={ruimtelijkePlannenUrl} target='_blank'><b>Bekijk bestemmingsplan</b></a>
                        {link}
                        <br />
                    </div>
                </Paper>
            </div>
        );
    }
}