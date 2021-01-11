import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Index from './components/index/Index';
import MapLayout from './components/index/MapLayout';
import MenuBar from './components/menu/MenuBar';
import WizardMenu from './components/index/WizardMenu';

const Main = () => {
    const settings = JSON.parse(process.env.REACT_APP_SETTINGS);

    const theme = createMuiTheme({
        overrides: {
            MuiSvgIcon: {
                root: {
                    fontSize: '24px'
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    color: '#111'
                }
            },
            MuiFormControlLabel: {
                root: {
                    marginBottom: '0'
                }
            },
            MuiRadio: {
                root: {
                    color: settings.gemeenteConfig.colorGemeente,
                    marginRight: '16px'
                }
            }
        }
    });

    const style = {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'inline-block'
    };

    return (
        <MuiThemeProvider theme={theme}>
                <div style={style}>
                    <header className="main-header">
                        <MenuBar settings={settings} />
                    </header>
                    <Switch>
                        <Route path="/" exact component={() => <Index settings={settings} />} />
                        <Route path="/wizard" exact component={() => <WizardMenu settings={settings} />} />
                        <Route path="/viewer" exact component={() => <MapLayout settings={settings} />} />
                    </Switch>
                </div>
        </MuiThemeProvider>
    );
};

(function() {
    // Load the settings
    const settings = JSON.parse(process.env.REACT_APP_SETTINGS);

    // Remove minified css
    const stylesheet = document.querySelector("link[href^='/static/css/']");
    stylesheet && document.getElementsByTagName('head')[0].removeChild(stylesheet);

    // Load custom css file
    const customStylesheet = document.createElement('link');
    customStylesheet.type = 'text/css';
    customStylesheet.rel = 'stylesheet';
    customStylesheet.href = './style/' + settings.gemeenteConfig.cssFile;
    document.getElementsByTagName('link')[0].appendChild(customStylesheet);

    // Change the title
    document.title = settings.gemeenteConfig.title;

    // Load custom favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '/' + settings.gemeenteConfig.favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
})();

ReactDOM.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>, document.getElementById('root')
);
