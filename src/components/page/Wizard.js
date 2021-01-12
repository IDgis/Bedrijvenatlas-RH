import React from 'react';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

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

        const CustomButton = withStyles((theme) => ({
            root: {
                backgroundColor:settings.gemeenteConfig.colorGemeente,
                position: 'relative',
                height: '36px',
                color: 'white',
                marginRight: '2em',
                marginBottom: '2em',
                fontSize: '14px',
                paddingLeft: '16px',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)'
                }
            }
        }))(Button);

        return (
            <div>
                <div className='row' style={style}>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>Naar wat voor pand bent u op zoek?</h2>
                        <RadioGroup name="pand" defaultValue="beide" onChange={this.setPandValue}>
                            <FormControlLabel value="bestaand" label="Ik zoek een bestaand pand" className='custom-radiobutton' control={<Radio />} />
                            <FormControlLabel value="nieuwbouw" label="Ik wil nieuw bouwen" className='custom-radiobutton' control={<Radio />} />
                            <FormControlLabel value="beide" label="Geen voorkeur" className='custom-radiobutton' control={<Radio />} />
                        </RadioGroup>
                    </div>
                </div>
                <div className='row' style={style}>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>Wilt u kopen of huren?</h2>
                        <RadioGroup name="huur-koop" defaultValue="beide" onChange={this.setHuurKoopValue}>
                            <FormControlLabel value="koop" label="Kopen" className='custom-radiobutton' control={<Radio />} />
                            <FormControlLabel value="huur" label="Huren" className='custom-radiobutton' control={<Radio />} />
                            <FormControlLabel value="beide" label="Geen voorkeur" className='custom-radiobutton' control={<Radio />} />
                        </RadioGroup>
                    </div>
                </div>
                <div className='row' style={style}>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12' style={{textAlign:'left',padding:'1em 20%'}}>
                        <h2 className='wizard-header'>In welke plaats zoekt u de mogelijkheden?</h2>
                        <RadioGroup name="plaats" defaultValue="beide" onChange={this.setPlaatsValue}>
                        {
                            settings.gemeenteConfig.plaatsen.map((plaats, index) => 
                                <FormControlLabel
                                    key={plaats.value + index}
                                    value={plaats.value}
                                    label={plaats.naam}
                                    className='custom-radiobutton'
                                    control={<Radio />}
                                />
                            )
                        }
                        </RadioGroup>
                    </div>
                </div>
                <Link to="/viewer">
                    <CustomButton className="wizard-button" color="primary" endIcon={<ArrowRight />}>
                        Zoek op de kaart
                    </CustomButton>
                </Link>
            </div>
        );
    }
}

export default Wizard;
