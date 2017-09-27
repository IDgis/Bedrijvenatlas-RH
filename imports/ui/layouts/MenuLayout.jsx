import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MenuBar from './MenuBar.jsx';

const MenuLayout = ({content}) => (
    <MuiThemeProvider>
        <div style={{/*height:'100%'*/}} >
            <header  style={{position:'fixed', width:'100%', zIndex:1, top:'0px'}} >
                <MenuBar />
            </header>
            <main style={{position:'fixed',backgroundColor:'#ccc', textAlign:'center', left:'0px', top:'56px', width:'100%', height:(window.innerHeight-56)}}>
                    { content }
            </main>
        </div>
    </MuiThemeProvider>
);

export default MenuLayout;