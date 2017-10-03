import React from 'react';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';

import ViewerLink from './ViewerLink';
import WizardLink from './WizardLink';

const styles = {
    color: '#333',
    wrapper: {
        width: '100%',
        overflow: 'hidden',
        marginTop: '80px',
    },
};

const WelcomePage = () => (
    <div style={styles}>
        <h1>Welkom bij de Bedrijvenatlas</h1>
        <div style={styles.wrapper}>
            <WizardLink />
            <ViewerLink />
        </div>
    </div>
);

export default WelcomePage;