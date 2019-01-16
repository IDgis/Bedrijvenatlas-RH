import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MenuBar from './MenuBar.jsx';

const pageStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'inline-block'
};

const welcomeLayoutStyle = {
    backgroundImage: `url(\'${Meteor.settings.public.gemeenteConfig.backgroundImage}\')`,
    backgroundSize: 'cover',
    position: 'absolute',
    textAlign: 'center',
    overflowY: 'auto',
    bottom: '0px',
    top: '56px',
    width: '100%'
};

export default MenuLayout = ({content}) => (
    <MuiThemeProvider>
        <div style={pageStyle}>
            <header className="main-header">
                <MenuBar />
            </header>
            <main style={welcomeLayoutStyle}>
                { content }
            </main>
        </div>
    </MuiThemeProvider>
);
