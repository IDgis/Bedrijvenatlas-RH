import React from 'react';

import ContactLink from '../link/ContactLink';
import ViewerLink from '../link/ViewerLink';
import WizardLink from '../link/WizardLink';

const Welcome = ({settings}) => {
    sessionStorage.setItem('pand', '');
    sessionStorage.setItem('huur-koop', '');
    sessionStorage.setItem('plaats', '');

    return (
        <div>
            <h1>Vind hier de ideale locatie voor uw bedrijf!</h1>
            <div className="row" style={{marginTop:'2em',marginRight:'0px',marginLeft:'0px'}}>
                <WizardLink settings={settings} />
                <ViewerLink settings={settings} />
                <ContactLink settings={settings} />
            </div>
        </div>
    );
}

export default Welcome;
