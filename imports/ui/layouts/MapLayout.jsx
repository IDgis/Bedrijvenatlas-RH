// https://medium.com/@ruthmpardee/passing-data-between-react-components-103ad82ebd17

import React, { Component } from 'react';
import * as ol from 'openlayers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MainHeader from './MainHeader.jsx';
import MenuBar from './MenuBar.jsx';
import PopupBagLigplaats from '../pages/viewer/components/PopupBagLigplaats.jsx';
import PopupBagPand from '../pages/viewer/components/PopupBagPand.jsx';
import PopupBagStandplaats from '../pages/viewer/components/PopupBagStandplaats.jsx';
import PopupBagVerblijfsobject from '../pages/viewer/components/PopupBagVerblijfsobject.jsx';
import PopupBagWoonplaats from '../pages/viewer/components/PopupBagWoonplaats.jsx';
import PopupIndustrie from '../pages/viewer/components/PopupIndustrie.jsx';
import PopupKvk from '../pages/viewer/components/PopupKvk.jsx';
import Viewer from '../pages/viewer/Viewer.jsx';


export default class MapLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            coords: {
                x: 0,
                y: 0
            },
            map: null,
            menuOpen: false,
            featurePopup: <div></div>
        };
    }

    /**
     * Update the mouse coordinates on the screen 
     */
    onMouseMove(e) {
        this.state.coords.x = e.screenX;
        this.state.coords.y = e.screenY;
    }

    /**
     * Sets the map variable to the state so it can be passed to other components
     */
    setMap = (mapVar) => {
        this.state.map = mapVar;
        this.addMapListener();
    };

    /**
     * Listen for click events on the map and creates a popup for the selected features.
     */
    addMapListener() {
        let map = this.state.map;
        let that = this;
    
        map.on('click', function(e) {
            that.setState({
                featurePopup: <div></div>
            });

            let pixel;
            if(e.pixel === undefined) {
                let size = map.getSize();
                let pixelX = size[0] / 2;
                let pixelY = size[1] / 2;
                pixel = [pixelX, pixelY];
            } else {
                pixel = e.pixel;
            }
            map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                if(layer.get('title') === 'Ibis Bedrijventerreinen') {
                    that.setState({featurePopup: <PopupIndustrie selectedFeature={feature} coords={that.state.coords} />})
                } else if(layer.get('title') === 'BAG Ligplaats') {
                    that.setState({featurePopup: <PopupBagLigplaats selectedFeature={feature} coords={that.state.coords} />})
                } else if(layer.get('title') === 'BAG Pand') {
                    that.setState({featurePopup: <PopupBagPand selectedFeature={feature} coords={that.state.coords} />})
                } else if(layer.get('title') === 'BAG Standplaats') {
                    that.setState({featurePopup: <PopupBagStandplaats selectedFeature={feature} coords={that.state.coords} />})
                } else if(layer.get('title') === 'BAG Verblijfsobject') {
                    that.setState({featurePopup: <PopupBagVerblijfsobject selectedFeature={feature} coords={that.state.coords} />})
                } else if(layer.get('title') === 'BAG Woonplaats') {
                    that.setState({featurePopup: <PopupBagWoonplaats selectedFeature={feature} coords={that.state.coords} />})
                } else if(layer.get('title') === 'Kvk Bedrijven') {
                    that.setState({featurePopup: <PopupKvk selectedFeature={feature} coords={that.state.coords} />})
                }
            });
        });
    }

    /**
     * Checks whether the menu is open or closed and passes its value to the state so the menu can be rendered
     */
    toggleMenuState = (newState) => {
        this.setState({
            menuOpen: newState
        });
    }

    /**
     * Renders the Map Layout to the screen.
     */
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <header>
                        <MainHeader />
                        <MenuBar toggleMenuState={this.toggleMenuState} menuOpen={this.state.menuOpen} />
                    </header>
                    <main onMouseMove={this.onMouseMove.bind(this)}>
                        <Viewer mapToParent={this.setMap} menuOpen={this.state.menuOpen} toggleMenuState={this.toggleMenuState} />
                        {this.state.featurePopup}
                    </main>
                </div>
            </MuiThemeProvider>
        );
    }
}