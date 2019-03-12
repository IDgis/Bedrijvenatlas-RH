import React from 'react';

import Welcome from '../page/Welcome';

const Index = ({settings}) => {
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
            <Welcome settings={settings} />
        </main>
    );
}

export default Index;
