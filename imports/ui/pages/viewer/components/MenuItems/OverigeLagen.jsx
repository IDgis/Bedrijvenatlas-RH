import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import Bedrijvenlaag from './Bedrijvenlaag';
import Kaartlaag from './Kaartlaag';

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Checkbox from 'material-ui/Checkbox';
import {List} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';

export default class OverigeLagen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            allKvkChecked: false,
            allVastgoedChecked: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            map: nextProps.map,
        });

        this.setAllKvkChecked();
        this.setAllVastgoedChecked();
    }

    /**
     * Turns all KVK layers on and off at once
     */
    selectAllKvkLayers = () => {
        let newVisible = !this.state.allKvkChecked;
        let kvk = Meteor.settings.public.kvkBedrijven.naam;
        let map = this.props.map;

        if(map != null) {
            let layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === kvk) {
                    layer.setVisible(newVisible);
                }
            });
        }

        this.setState({
            allKvkChecked: newVisible
        });
        this.props.updateLegenda();
    }

    /**
     * Turns all Vastgoed layers on and off at once
     */
    selectAllVastgoedLayers = (event, l) => {
        const newVisible = !this.state.allVastgoedChecked;
        const fundaLayers = Meteor.settings.public.fundaLayers;

        if (this.props.map) {
            const layers = this.props.map.getLayers();
            fundaLayers.forEach(fundaLayer => {
                layers.forEach(layer => {
                    if (layer.get('title') === fundaLayer.titel) {
                        layer.setVisible(newVisible);
                    }
                });
            });
        }

        this.setState({
            allVastgoedChecked: newVisible
        });
        
        this.props.updateLegenda();
    }

    /**
     * Checks whether all KVK layers are checked or not and sets its internal state
     */
    setAllKvkChecked = () => {
        const kvk = Meteor.settings.public.kvkBedrijven.naam;
        const map = this.props.map;

        if(map != null) {
            let allVisible = true;
            const layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === kvk) {
                    allVisible = allVisible && layer.getVisible();
                }
            });

            this.setState({
                allKvkChecked: allVisible
            });
        }
    }

    /**
     * Checks whether all Vastgoed layers are checked or not and sets its internal state
     */
    setAllVastgoedChecked = () => {
        const fundaLayers = Meteor.settings.public.fundaLayers;

        if (this.props.map) {
            let allVisible = true;
            const layers = this.props.map.getLayers();
            fundaLayers.forEach(fundaLayer => {
                layers.forEach(layer => {
                    if (layer.get('title') === fundaLayer.titel) {
                        allVisible = allVisible && layer.getVisible();
                    }
                });
            });
            this.setState({
                allVastgoedChecked: allVisible
            });
        }
    }

    /**
     * Get the visibility of all KVK layers
     */
    getAllKvkChecked = () => {
        const kvk = Meteor.settings.public.kvkBedrijven.naam;
        const map = this.props.map;
        let visible = false

        if(map !== null) {
            let layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === kvk) {
                    if(layer.getVisible()) visible = true;
                }
            });
            return visible;
        }
        return false;
    }

    /**
     * Get the visibility of all Vastgoed layers
     */
    getAllVastgoedChecked = () => {
        const fundaLayers = Meteor.settings.public.fundaLayers;
        let anyVisible = false;

        if (this.props.map) {
            const layers = this.props.map.getLayers();
            fundaLayers.forEach(fundaLayer => {
                layers.forEach(layer => {
                    if (layer.get('title') === fundaLayer.titel && layer.getVisible()) {
                        anyVisible = true;
                    }
                });
            });
            return anyVisible;
        }
        return anyVisible;
    }

    getFundaMenuItems = () => (
        Meteor.settings.public.fundaLayers.map((layer, index) => (
            <Kaartlaag layer={layer} map={this.props.map} updateParent={this.setAllVastgoedChecked} updateLegenda={this.props.updateLegenda} key={layer.titel + index} />
        ))
    );

    getCustomLayers = () => (
        Meteor.settings.public.overlayLayers.map((layer, index) => (
            <Kaartlaag layer={layer} map={this.props.map} updateLegenda={this.props.updateLegenda} key={layer.titel + index} />
        ))
    )

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        const allVastgoedChecked = this.getAllVastgoedChecked();
        const allKvkChecked = this.getAllKvkChecked();

        const fundaMenuItems = this.getFundaMenuItems();
        const customLayers = this.getCustomLayers();

        return (
            <List className='list-menu' >
                <MenuItem className='list-item' primaryText='Te Koop/Huur' 
                    leftIcon={<Checkbox checked={allVastgoedChecked} onTouchTap={this.selectAllVastgoedLayers} iconStyle={{fill:'white'}} />}
                    rightIcon={<ArrowDropRight style={{fill:'white'}} />}
                    menuItems={fundaMenuItems}
                    />
                <MenuItem className='list-item' primaryText={Meteor.settings.public.kvkBedrijven.naam}
                    leftIcon={<Checkbox checked={allKvkChecked} onTouchTap={this.selectAllKvkLayers} iconStyle={{fill:'white'}} />}
                    rightIcon={<ArrowDropRight style={{fill:'white'}} />}
                    menuItems={<Bedrijvenlaag 
                        layer={Meteor.settings.public.kvkBedrijven} 
                        map={this.props.map} 
                        updateParent={this.setAllKvkChecked} 
                        updateLegenda={this.props.updateLegenda} />}
                    />
                { customLayers }
            </List>
        );
    }
}