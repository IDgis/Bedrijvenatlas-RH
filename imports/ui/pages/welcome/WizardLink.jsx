import React, { Component } from 'react';


export default class WizardLink extends Component {

    render() {
        return (
            <a href="/wizard" className='a-link'>
                <div className='wizard-link'>
                    <div>
                        <img className='image-link' src={Meteor.settings.public.gemeenteConfig.logoWizardKnop} />
                    </div>
                    <div className='text-link'>
                        <h2>Ik wil een bedrijf (her)vestigen</h2>
                    </div>
                </div>
            </a>
        );
    }
}