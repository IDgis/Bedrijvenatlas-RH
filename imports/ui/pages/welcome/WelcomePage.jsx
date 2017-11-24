import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import ViewerLink from './ViewerLink';
import WizardLink from './WizardLink';


export default class WelcomePage extends Component {

    constructor(props) {
        super(props);

        Session.set('pand', '');
        Session.set('huur-koop', '');
        Session.set('plaats', '');
    }

    render() {

        return(
            <div>
                <h1>Vind hier de ideale locatie voor uw bedrijf!</h1>
                <div>
                    <WizardLink />
                    <ViewerLink />
                </div>
            </div>
        );
    }
}