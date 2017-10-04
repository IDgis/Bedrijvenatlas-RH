import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';

import ViewerLink from './ViewerLink';
import WizardLink from './WizardLink';


export default class WelcomePage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <h1>Welkom bij de Bedrijvenatlas</h1>
                <div>
                    <WizardLink />
                    <ViewerLink />
                </div>
            </div>
        );
    }
}