import React from 'react';

import Wizard from '../page/Wizard';

const WizardMenu = ({settings}) => {
    const style = {
        backgroundImage: `url('${settings.gemeenteConfig.backgroundImage}')`,
        backgroundSize: 'cover',
        position: 'absolute',
        textAlign: 'center',
        overflowY: 'auto',
        bottom: '0px',
        top: '56px',
        width: '100%'
    };

    return (
        <main style={style}>
            <Wizard settings={settings} />
        </main>
    );
}

export default WizardMenu;
