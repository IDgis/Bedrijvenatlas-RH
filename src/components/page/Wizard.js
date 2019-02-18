import React from 'react';
import { Link } from 'react-router-dom';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    marginLeft: '0px',
    marginRight: '0px'
}

class Wizard extends React.Component {

    setPandValue = (e, value) => {
        sessionStorage.setItem('pand', value);
    }

    setHuurKoopValue = (e, value) => {
        sessionStorage.setItem('huur-koop', value);
    }

    setPlaatsValue = (e, value) => {
        sessionStorage.setItem('plaats', value);
    }

    render() {
        sessionStorage.setItem('pand', 'beide');
        sessionStorage.setItem('huur-koop', 'beide');
        sessionStorage.setItem('plaats', 'beide');

        const {settings} = this.props;

        return (
            <div>
                <div className='row' style={style}>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>Naar wat voor pand bent u op zoek?</h2>
                        <RadioButtonGroup name="pand" defaultSelected="beide" onChange={this.setPandValue}>
                            <RadioButton value="bestaand" label="Ik zoek een bestaand pand" className='custom-radiobutton' iconStyle={{fill: settings.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="nieuwbouw" label="Ik wil nieuw bouwen" className='custom-radiobutton' iconStyle={{fill: settings.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="beide" label="Geen voorkeur" className='custom-radiobutton' iconStyle={{fill: settings.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                        </RadioButtonGroup>
                    </div>
                </div>
                <div className='row' style={style}>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>Wilt u kopen of huren?</h2>
                        <RadioButtonGroup name="huur-koop" defaultSelected="beide" onChange={this.setHuurKoopValue}>
                            <RadioButton value="koop" label="Kopen" className='custom-radiobutton' iconStyle={{fill: settings.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="huur" label="Huren" className='custom-radiobutton' iconStyle={{fill: settings.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                            <RadioButton value="beide" label="Geen voorkeur" className='custom-radiobutton' iconStyle={{fill: settings.gemeenteConfig.colorGemeente}} labelStyle={{color:'#111'}} />
                        </RadioButtonGroup>
                    </div>
                </div>
                <div className='row' style={style}>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>In welke plaats zoekt u de mogelijkheden?</h2>
                        <RadioButtonGroup name="plaats" defaultSelected="beide" onChange={this.setPlaatsValue}>
                        {
                            settings.gemeenteConfig.plaatsen.map((plaats, index) => 
                                <RadioButton 
                                    key={plaats.value + index} 
                                    value={plaats.value} 
                                    label={plaats.naam} 
                                    className='custom-radiobutton' 
                                    iconStyle={{fill: settings.gemeenteConfig.colorGemeente}} 
                                    labelStyle={{color: '#111'}} 
                                />
                            )
                        }
                        </RadioButtonGroup>
                    </div>
                </div>
                <Link to="/viewer">
                    <RaisedButton 
                        className='wizard-button'
                        label="Zoek op de kaart" 
                        labelPosition="before"
                        primary={true} 
                        buttonStyle={{backgroundColor:settings.gemeenteConfig.colorGemeente}}
                        icon={ <img style={{height:'100%'}} src="/images/navigate_next_w.png" alt="" /> }
                    />
                </Link>
            </div>
        );
    }
}

export default Wizard;
