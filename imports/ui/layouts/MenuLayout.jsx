import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

import MainHeader from './MainHeader.jsx';
import MenuBar from './MenuBar.jsx';

const style = {
    paper: {
        backgroundColor: '#ccc',
        textAlign: 'center',
        height: '840px',
    }
};

const MenuLayout = ({content}) => (
    <MuiThemeProvider>
        <div>
            <header  style={{position:'fixed', width:'100%'}} >
                <MainHeader />
                <MenuBar />
            </header>
            <main style={{position:'absolute', top:'120px', height:'840px', width:'100%'}}>
                <Paper style={style.paper} zDepth={3} rounded={true} transitionEnabled={false}>
                    { content }
                </Paper>
            </main>
        </div>
    </MuiThemeProvider>
);

export default MenuLayout;