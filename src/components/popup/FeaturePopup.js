import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


class FeaturePopup extends React.Component {

    getPopupFields = () => {
        const { settings, feature } = this.props;
        const properties = feature.getProperties();
        const keys = Object.keys(properties);
        const aliasKeys = Object.keys(settings.aliassen);

        const propertyFields = keys.filter(key => typeof properties[key] !== 'object').map((key, index) => {
            const alias = this.getAlias(key, aliasKeys);
            if (typeof properties[key] === 'string' && properties[key].indexOf('http') !== -1) {
                return (
                    <tr key={`field_${index}`}>
                        <td colSpan={2} style={{width:'450px',paddingBottom:'5px',paddingTop:'5px'}}>
                            <RaisedButton href={properties[key]} target='_blank' label={`Meer informatie (${alias})`} />
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={`property_${index}`}>
                        <td style={{width:'100px'}}><b>{alias}:</b></td>
                        <td style={{width:'350px'}}>{properties[key]}</td>
                    </tr>
                );
            }
        });

        const bestemmingsplanButton = this.getBestemmingsplanButton();
        const streetviewButton = this.getStreetviewButton();
        const fields = [...propertyFields, bestemmingsplanButton, streetviewButton];

        return fields;
    }

    getAlias = (key, aliasKeys) => {
        const { settings } = this.props;
        let alias = key;
        [...aliasKeys].forEach(aliasKey => {
            if (aliasKey === key) {
                alias = settings.aliassen[key];
            }
        });

        return alias;
    }

    getBestemmingsplanButton = () => {
        const { coords } = this.props;
        const x = coords[0];
        const y = coords[1];

        const bbx1 = Number.parseFloat(x) - 250;
        const bbx2 = Number.parseFloat(x) + 250;
        const bby1 = Number.parseFloat(y) - 425;
        const bby2 = Number.parseFloat(y) + 425;

        const ruimtelijkeplannenUrl = `https://www.ruimtelijkeplannen.nl/viewer/viewer?` +
            `bbx1=${bbx1}&bby1=${bby1}&bbx2=${bbx2}&bby2=${bby2}`;

        return (
            <tr key={'field_bestemmingsplanbutton'}>
                <td colSpan={2} style={{width:'450px',paddingBottom:'5px',paddingTop:'5px'}}>
                    <RaisedButton href={ruimtelijkeplannenUrl} target='_blank' label='Bestemmingsplan' />
                </td>
            </tr>
        );
    }

    getStreetviewButton = () => (
        <tr key={'field_streetview'}>
            <td colSpan={2} style={{width:'450px',paddingBottom:'5px',paddingTop:'5px'}}>
                <RaisedButton label='Streetview' onClick={this.props.openStreetView} />
            </td>
        </tr>
    );

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

    getMilieuCategorie = () => {
        const { milieuCategorie } = this.props;

        if (milieuCategorie) {
            return (
                <tr key={'property_milieucategorie'}>
                    <td style={{width:'100px'}}><b>Categorie:</b></td>
                    <td style={{width:'350px'}}>{milieuCategorie}</td>
                </tr>
            );
        } else {
            return <tr key='no_categorie' style={{display:'none'}}></tr>;
        }
    }

    render() {
        const { settings } = this.props;
        const width = 500;
        const left = this.getHorizontalPosition(width);

        const popupFields = [this.getMilieuCategorie(), ...this.getPopupFields()];

        return (
            <Paper style={{position:'absolute', width:width, top:'60px', left:left, borderRadius:5, zIndex:10, backgroundColor:settings.gemeenteConfig.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                <div style={{position:'relative', left:'20px'}}><br />
                    <h3><u>{this.props.layer.get('title')}</u></h3>
                    <table><tbody>{popupFields}</tbody></table>
                    <br />
                </div>
            </Paper>
        );
    }
}

export default FeaturePopup;
