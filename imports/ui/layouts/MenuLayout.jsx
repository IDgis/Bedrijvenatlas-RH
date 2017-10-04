import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MenuBar from './MenuBar.jsx';

const MenuLayout = ({content}) => (
    <MuiThemeProvider>
        <div>
            <header className='main-header'>
                <MenuBar />
            </header>
            <main className='welcome-layout'>
                    { content }
            </main>
        </div>
    </MuiThemeProvider>
);

export default MenuLayout;