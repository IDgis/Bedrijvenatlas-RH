import React, { Component } from 'react';
import { Session } from 'meteor/session';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';


export default class WizardPage extends Component {

    constructor(props) {
        super(props);
        
        Session.set('pand', 'beide');
        Session.set('huur-koop', 'beide');
        Session.set('plaats', 'beide');
    }

    setPandValue(event, value) {
        Session.set('pand', value);
    }

    setHuurKoopValue(event, value) {
        Session.set('huur-koop', value);
    }
    
    setPlaatsValue(event, value) {
        Session.set('plaats', value);
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>Naar wat voor pand bent u op zoek?</h2>
                        <RadioButtonGroup name="pand" defaultSelected="beide" onChange={this.setPandValue.bind(this)}>
                            <RadioButton value="bestaand" label="Ik zoek een bestaand pand" className='custom-radiobutton' iconStyle={{fill: Meteor.settings.public.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="nieuwbouw" label="Ik wil nieuw bouwen" className='custom-radiobutton' iconStyle={{fill: Meteor.settings.public.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="beide" label="Geen voorkeur" className='custom-radiobutton' iconStyle={{fill: Meteor.settings.public.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                        </RadioButtonGroup>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>Wilt u kopen of huren?</h2>
                        <RadioButtonGroup name="huur-koop" defaultSelected="beide" onChange={this.setHuurKoopValue.bind(this)}>
                            <RadioButton value="koop" label="Kopen" className='custom-radiobutton' iconStyle={{fill: Meteor.settings.public.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="huur" label="Huren" className='custom-radiobutton' iconStyle={{fill: Meteor.settings.public.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="beide" label="Geen voorkeur" className='custom-radiobutton' iconStyle={{fill: Meteor.settings.public.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                        </RadioButtonGroup>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>In welke plaats zoekt u de mogelijkheden?</h2>
                        <RadioButtonGroup name="plaats" defaultSelected="beide" onChange={this.setPlaatsValue.bind(this)}>
                        {
                            Meteor.settings.public.gemeenteConfig.plaatsen.map((plaats, index) => 
                                <RadioButton 
                                    key={plaats.value + index} 
                                    value={plaats.value} 
                                    label={plaats.naam} 
                                    className='custom-radiobutton' 
                                    iconStyle={{fill: Meteor.settings.public.gemeenteConfig.colorGemeente}} 
                                    labelStyle={{color: '#111'}} 
                                />
                            )
                        }
                        </RadioButtonGroup>
                    </div>
                </div>
                <RaisedButton 
                    className='wizard-button'
                    href="/viewer" 
                    label="Zoek op de kaart" 
                    labelPosition="before"
                    primary={true} 
                    buttonStyle={{backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente}}
                    icon={ <img style={{height:'100%'}} src="/images/navigate_next_w.png" /> }
                />
            </div>
        );
    }
}
