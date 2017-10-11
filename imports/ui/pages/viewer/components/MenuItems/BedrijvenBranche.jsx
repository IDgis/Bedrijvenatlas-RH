import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class BedrijvenBranche extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            menuOpen: false,
            C: false,
            E: false,
            F: false,
            G: false,
            H: false,
            I: false,
            J: false,
            K: false,
            L: false,
            M: false,
            N: false,
            P: false,
            Q: false,
            S: false
        }
        this.updateVisibility();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            map: nextProps.map
        });
        this.updateVisibility();
    }

    openMenu= (event) => {
        this.setState({
            menuOpen: true,
            anchorEl: event.currentTarget
        });
    }

    closeMenu = () => {
        this.setState({
            menuOpen: false
        });
    }

    /**
     * Show the icons of the selected branche on the map
     */
    selectBranche = (e) => {
        let categorie = e.target.value;
        let map = this.state.map;
        let layers = map.getLayers();
        layers.forEach((layer, index, arr) => {
            if(layer.get('title') === Meteor.settings.public.laagNaam.kvk) {
                let source = layer.getSource();
                if(source.getState() === 'ready') {
                    let features = source.getFeatures();
                    let id = features[0].get('SBI_RUBR_C');
                    if(id === categorie) {
                        layer.setVisible(!layer.getVisible());
                        this.setVisibility(categorie, layer.getVisible());
                    }
                }
            }
            if(this.props.updateParent !== undefined) {
                this.props.updateParent();
            }
        });
    }

    updateVisibility = () => {
        let map = this.state.map;
        if(map !== null) {
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === Meteor.settings.public.laagNaam.kvk) {
                    let source = layer.getSource();
                    if(source.getState() === 'ready') {
                        let features = source.getFeatures();
                        let id = features[0].get('SBI_RUBR_C');
                        this.setVisibility(id, layer.getVisible());
                    }
                }
            });
        }
    }

    /**
     * Set the visibility, so the checkbox shows the right value
     */
    setVisibility = (cat, newVisible) => {
        switch (cat) {
            case 'C': this.state.C = newVisible; break;
            case 'E': this.state.E = newVisible; break;
            case 'F': this.state.F = newVisible; break;
            case 'G': this.state.G = newVisible; break;
            case 'H': this.state.H = newVisible; break;
            case 'I': this.state.I = newVisible; break;
            case 'J': this.state.J = newVisible; break;
            case 'K': this.state.K = newVisible; break;
            case 'L': this.state.L = newVisible; break;
            case 'M': this.state.M = newVisible; break;
            case 'N': this.state.N = newVisible; break;
            case 'P': this.state.P = newVisible; break;
            case 'Q': this.state.Q = newVisible; break;
            case 'S': this.state.S = newVisible; break;
            default: break;
        }
    }

    /**
     * Get all menu items per branche and show them in a list
     */
    getMenuItems = (val) => {
        if(this.state.map !== null) {
            let retArr = [];
            let map = this.state.map;
            let layers = map.getLayers();
            layers.forEach((layer, index, arr) => {
                if(layer.get('title') === Meteor.settings.public.laagNaam.kvk) {
                    let source = layer.getSource();
                    if(source.getState() === 'ready') {
                        let features = source.getFeatures();
                        for(let i = 0; i < features.length; i++) {
                            let id = features[i].get('SBI_RUBR_C');
                            if(id === val) {
                                let name = features[i].get('BEDR_NAAM');
                                retArr.push(<ListItem primaryText={name} key={i} onClick={this.triggerClick} />);
                            }
                        }
                    }
                }
            });
            return retArr;
        }
    }

    /**
     * If clicked on a menu item, select the clicked name and zoom in to it
     */
    triggerClick = (event) => {
        let clickedName = event.target.textContent;
        let map = this.state.map;
        let layers = map.getLayers();
        layers.forEach((layer, index, arr) => {
            if(layer.get('title') === Meteor.settings.public.laagNaam.kvk) {
                let newSearch = true;
                let source = layer.getSource();
                if(source.getState() === 'ready') {
                    let features = source.getFeatures();
                    for(let i = 0; i < features.length; i++) {
                        if(features[i].get('BEDR_NAAM') === clickedName && newSearch) {
                            newSearch = false;
                            let cat = features[i].get('SBI_RUBR_C');
                            layer.setVisible(true);
                            this.setVisibility(cat, layer.getVisible());

                            // Center around the coordinates of the found feature
                            let coords = features[i].getGeometry().getCoordinates();
                            map.getView().setCenter(coords[0]);

                            // Zoom to the feature found
                            map.getView().setZoom(17);

                            let select = new ol.interaction.Select({
                                style: [
                                    new ol.style.Style({
                                        image: new ol.style.Icon({
                                            src: Meteor.settings.public.iconSelected,
                                            scale: 0.5
                                        }),
                                        zIndex: 1
                                    }),
                                    new ol.style.Style({
                                        image: new ol.style.Icon({
                                            src: Meteor.settings.public.iconShadow,
                                            scale: 0.5
                                        }),
                                        zIndex: 0
                                    })
                                ]
                            });
                            map.addInteraction(select);
                            let collection = select.getFeatures().push(features[i]);

                            this.closeMenu();
                        }
                    }
                }
            }
        });
    }

    /**
     * The render method to render the component
     */
    render() {
        const categorien = [];
        for(c in Meteor.settings.public.categorieUrl) {
            categorien.push(c);
        }

        const menuItems = categorien.map((val, i) => 
            <ListItem className='list-item' primaryText={Meteor.settings.public.categorieNaam[val]}
                leftIcon={<Checkbox checked={this.state[val]} onClick={this.selectBranche} value={val} />}
                rightIcon={<Avatar src={Meteor.settings.public.categorieUrl[val]} />}
                key={i}
            />
        );

        return(
            <List>
                {menuItems}
            </List>
        );
    }
}