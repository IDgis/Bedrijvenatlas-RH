import React, { Component } from 'react';

const style = {
    position: 'relative',
    backgroundColor: 'inherit',
    width: '40%',
    height: '500px',
    marginLeft: '70px',
    float: 'left',
    a: {
        textDecoration: 'none',
        color: '#000'
    },
    image: {
        position: 'relative',
        top: '10px',
        width: '80%',
        maxWidth: '60%'
    },
    text: {
        position: 'relative',
        bottom: '10px',
        color: '#333'
    }
};

export default class WizardLink extends Component {

    render() {
        return (
            <a href="/wizard" style={style.a}>
                <div style={style}>
                    <div>
                        <img style={style.image} src={Meteor.settings.public.logoWizardUrl} />
                    </div>
                    <div style={style.text}>
                        <h2>Ik wil een bedrijf (her)vestigen</h2>
                    </div>
                </div>
            </a>
        );
    }
}