import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

import MainHeader from './MainHeader.jsx';
import MenuBar from './MenuBar.jsx';

const style = {
    main: {
        position: 'relative',
        backgroundColor: '#76e29a',
        height: '840px'
    },
    paper: {
        position: 'absolute',
        backgroundColor: '#ccc',
        textAlign: 'center',
        top: '130px',
        bottom: '10px',
        left: '10px',
        right: '10px',
    }
};

const MenuLayout = ({content}) => (
    <MuiThemeProvider>
        <div>
            <header>
                <MainHeader />
                <MenuBar />
            </header>
            <main>
                <div style={style.main}></div>
                <Paper style={style.paper} zDepth={3} rounded={true} transitionEnabled={false}>
                    { content }
                </Paper>
            </main>
        </div>
    </MuiThemeProvider>
);

export default MenuLayout;