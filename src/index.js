import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Index from './components/index/Index';
import MapLayout from './components/index/MapLayout';
import MenuBar from './components/menu/MenuBar';
import WizardMenu from './components/index/WizardMenu';

const Main = () => {
    const settings = JSON.parse(process.env.REACT_APP_SETTINGS);

    const style = {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'inline-block'
    };

    return (
        <MuiThemeProvider>
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
    const settings = JSON.parse(process.env.REACT_APP_SETTINGS);
    require('./' + settings.gemeenteConfig.cssFile);
    document.title = settings.gemeenteConfig.title;
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '/' + settings.gemeenteConfig.favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
    injectTapEventPlugin();
})();

ReactDOM.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>, document.getElementById('root')
);
