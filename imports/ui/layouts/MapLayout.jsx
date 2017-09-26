// https://medium.com/@ruthmpardee/passing-data-between-react-components-103ad82ebd17

import React, { Component } from 'react';
import * as ol from 'openlayers';
import proj4 from 'proj4';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MainHeader from './MainHeader.jsx';
import MenuBar from './MenuBar.jsx';
import Popup from '../pages/viewer/components/popups/Popup.jsx';
import Streetview from '../pages/viewer/Streetview.jsx';
import Viewer from '../pages/viewer/Viewer.jsx';


export default class MapLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            coords: {
                x: 0,
                y: 0
            },
            location: {
                x: 0,
                y: 0
            },
            map: null,
            menuOpen: false,
            featurePopup: <div></div>,
            streetView: <div></div>
        };
    }

    /**
     * Update the mouse coordinates on the screen 
     */
    onMouseMove(e) {
        this.state.coords.x = e.screenX;
        this.state.coords.y = e.screenY;

        let map = this.state.map;
        let that = this;
    }

    /**
     * Sets the map variable to the state so it can be passed to other components
     */
    setMap = (mapVar) => {
        this.setState({
            map: mapVar
        });
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
                featurePopup: <div></div>,
                location: {
                    x: e.coordinate[0],
                    y: e.coordinate[1]
                }
            });

            map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                let title = layer.get('title');
                let searchFields = Meteor.settings.public.searchFields[title];
                that.setState({featurePopup: <Popup title={title} selectedFeature={feature} coords={that.state.coords} searchFields={searchFields} map={that.state.map} openStreetView={that.openStreetView} />})
            });
        });
    }

    setKvkPopup = (feature) => {
        this.state.coords.x = window.innerWidth / 2 + 20;
        this.state.coords.y = window.innerHeight / 2;
        //feature = feature.values_;
        //console.log(feature['BEDR_NAAM']);
        this.setState({featurePopup: <Popup title={Meteor.settings.public.laagNaam.kvk} selectedFeature={feature} coords={this.state.coords} />});
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
     * Opens streetview in the bottom right of the screen
     */
    openStreetView = (event) => {
        proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        ol.proj.setProj4(proj4);
        let oldCoord=[this.state.location.x,this.state.location.y];
        let coord = ol.proj.transform([oldCoord[0],oldCoord[1]],'EPSG:28992','EPSG:4326');

        this.setState({
            streetView: <Streetview coords={coord} close={this.closeStreetView} />,
            featurePopup: <div></div>
        })
    }

    /**
     * Closes the streetview component
     */
    closeStreetView = (event) => {
        this.setState({
            streetView: <div></div>,
            featurePopup: <div></div>
        });
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        ol.proj.setProj4(proj4);
        let oldCoord=[this.state.location.x,this.state.location.y];
        let coord = ol.proj.transform([oldCoord[0],oldCoord[1]],'EPSG:28992','EPSG:4326');

        return (
            <MuiThemeProvider>
                <div style={{height:'100%'}} >
                    <header style={{position:'fixed', width:'100%', zIndex:1 }} >
                        <MainHeader />
                        <MenuBar toggleMenuState={this.toggleMenuState} menuOpen={this.state.menuOpen} />
                    </header>
                    <main onMouseMove={this.onMouseMove.bind(this)} style={{position:'absolute', top:'125px', width:'100%'}} >
                        <Viewer mapToParent={this.setMap} menuOpen={this.state.menuOpen} toggleMenuState={this.toggleMenuState} featurePopup={this.setKvkPopup} />
                        {this.state.featurePopup}
                        {/*<Streetview coords={coord} />*/}
                        {this.state.streetView}
                    </main>
                </div>
            </MuiThemeProvider>
        );
    }
}