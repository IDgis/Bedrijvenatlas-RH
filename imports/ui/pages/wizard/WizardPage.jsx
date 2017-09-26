import React, { Component } from 'react';
import { Session } from 'meteor/session';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    radioButton: {
        position: 'relative',
        fontSize: '150%',
        marginBottom: 16
    },
    questions: {
        position: 'absolute',
        textAlign: 'left',
        left: '35%',
        top: '5%',
        color: '#333'
    },
    h2: {
        position: 'relative',
        marginBottom: 20
    },
    button: {
        position: 'absolute',
        right: '60px',
        bottom: '30px'
}
};

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
                <div style={styles.questions}>
                    <div>
                        <h2 style={styles.h2}>Naar wat voor pand bent u op zoek?</h2>
                        <RadioButtonGroup name="pand" defaultSelected="beide" onChange={this.setPandValue.bind(this)}>
                            <RadioButton value="bestaand" label="Ik zoek een bestaand pand" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                            <RadioButton value="nieuwbouw" label="Ik wil nieuw bouwen" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                            <RadioButton value="beide" label="Geen voorkeur" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                        </RadioButtonGroup>
                    </div>
                    <div>
                        <h2 style={styles.h2}>Wilt u kopen of huren?</h2>
                        <RadioButtonGroup name="huur-koop" defaultSelected="beide" onChange={this.setHuurKoopValue.bind(this)}>
                            <RadioButton value="koop" label="Kopen" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                            <RadioButton value="huur" label="Huren" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                            <RadioButton value="beide" label="Geen voorkeur" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                        </RadioButtonGroup>
                    </div>
                    <div>
                        <h2 style={styles.h2}>In welke plaats zoekt u de mogelijkheden?</h2>
                        <RadioButtonGroup name="plaats" defaultSelected="beide" onChange={this.setPlaatsValue.bind(this)}>
                            <RadioButton value="rijssen" label="Rijssen" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                            <RadioButton value="holten" label="Holten" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                            <RadioButton value="beide" label="Geen voorkeur" style={styles.radioButton} iconStyle={{fill: '#730049'}} labelStyle={{color:'#333'}} />
                        </RadioButtonGroup>
                    </div>
                </div>
                <RaisedButton 
                    href="/viewer" 
                    label="Naar de viewer" 
                    labelPosition="before"
                    primary={true} 
                    buttonStyle={{backgroundColor:Meteor.settings.public.colorGemeente}} 
                    style={styles.button} 
                    icon={ <img style={{height:'100%'}} src="/images/navigate_next_w.png" /> }
                    /*onTouchTap={}*/
                />
            </div>
        );
    }
}