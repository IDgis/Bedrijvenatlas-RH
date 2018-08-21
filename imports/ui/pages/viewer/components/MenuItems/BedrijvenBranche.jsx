import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';

export default class BedrijvenBranche extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            menuOpen: false
        }
        this.setDefaultVisibility();
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
        const categorie = e.target.value;
        const map = this.state.map;
        const layers = map.getLayers();
        layers.forEach(layer => {
            if(layer.get('title') === Meteor.settings.public.kvkBedrijven.naam) {
                const source = layer.getSource();
                if(source.getState() === 'ready') {
                    const features = source.getFeatures();
                    const id = features[0].get('SBI_RUBR_C');
                    if(id === categorie) {
                        layer.setVisible(!layer.getVisible());
                        this.state[categorie] = layer.getVisible();
                    }
                }
            }
            if(this.props.updateParent !== undefined) {
                this.props.updateParent();
            }
        });
        this.props.updateLegenda();
    }

    setDefaultVisibility = () => {
        const kvkCategorieen = Object.keys(Meteor.settings.public.kvkBedrijven.namen);
        kvkCategorieen.forEach(category => {
            this.state[category] = false;
        });
    }

    updateVisibility = () => {
        const map = this.state.map;
        if(map !== null) {
            const layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === Meteor.settings.public.kvkBedrijven.naam) {
                    const source = layer.getSource();
                    if(source.getState() === 'ready') {
                        const features = source.getFeatures();
                        const id = features[0].get('SBI_RUBR_C');
                        this.state[id] = layer.getVisible();
                    }
                }
            });
        }
    }

    /**
     * Get all menu items per branche and show them in a list
     */
    getMenuItems = (val) => {
        if(this.state.map !== null) {
            const retArr = [];
            const map = this.state.map;
            const layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === Meteor.settings.public.kvkBedrijven.naam) {
                    const source = layer.getSource();
                    if(source.getState() === 'ready') {
                        const features = source.getFeatures();
                        for(let i = 0; i < features.length; i++) {
                            const id = features[i].get('SBI_RUBR_C');
                            if(id === val) {
                                const name = features[i].get('BEDR_NAAM');
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
        const clickedName = event.target.textContent;
        const map = this.state.map;
        const layers = map.getLayers();
        layers.forEach(layer => {
            if(layer.get('title') === Meteor.settings.public.kvkBedrijven.naam) {
                let newSearch = true;
                const source = layer.getSource();
                if(source.getState() === 'ready') {
                    let features = source.getFeatures();
                    for(let i = 0; i < features.length; i++) {
                        if(features[i].get('BEDR_NAAM') === clickedName && newSearch) {
                            newSearch = false;
                            const cat = features[i].get('SBI_RUBR_C');
                            layer.setVisible(true);
                            this.state[cat] = layer.getVisible();

                            // Center around the coordinates of the found feature
                            const coords = features[i].getGeometry().getCoordinates();
                            map.getView().setCenter(coords[0]);

                            // Zoom to the feature found
                            map.getView().setZoom(17);

                            const select = new ol.interaction.Select({
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
                            select.getFeatures().push(features[i]);

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
        const categorien = Object.keys(Meteor.settings.public.kvkBedrijven.icons);

        const menuItems = categorien.map((val, i) => 
            <ListItem className='list-item' primaryText={Meteor.settings.public.kvkBedrijven.namen[val]}
                leftIcon={<Checkbox checked={this.state[val]} onClick={this.selectBranche} value={val} iconStyle={{fill:'white'}} />}
                rightIcon={<Avatar src={Meteor.settings.public.kvkBedrijven.icons[val]} />}
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