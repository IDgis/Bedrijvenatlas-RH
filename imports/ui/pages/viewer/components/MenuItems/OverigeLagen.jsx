import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import BedrijvenBranche from './BedrijvenBranche.jsx';
import Kaartlaag from './Kaartlaag.jsx';

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
        let newVisible = !this.state.allVastgoedChecked;

        let teKoop = Meteor.settings.public.laagNaam.teKoop;
        let teHuur = Meteor.settings.public.laagNaam.teHuur;

        let map = this.props.map;
        if(map != null) {
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === teKoop || layer.get('title') === teHuur) {
                    layer.setVisible(newVisible);
                }
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
        let teKoop = Meteor.settings.public.laagNaam.teKoop;
        let teHuur = Meteor.settings.public.laagNaam.teHuur;

        let map = this.props.map;
        if(map != null) {
            let allVisible = true;
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === teKoop || layer.get('title') === teHuur) {
                    allVisible = allVisible && layer.getVisible();
                }
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
        let teKoop = Meteor.settings.public.laagNaam.teKoop;
        let teHuur = Meteor.settings.public.laagNaam.teHuur;
        let map = this.props.map;
        let visible = false;

        if(map !== null) {
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === teKoop || layer.get('title') === teHuur) {
                    if(layer.getVisible()) visible = true;
                }
            });
            return visible;
        }
        return visible;
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        const allVastgoedChecked = this.getAllVastgoedChecked();
        const allKvkChecked = this.getAllKvkChecked();

        return (
            <List className='list-menu' >
                <MenuItem className='list-item' primaryText={Meteor.settings.public.laagNaam.vastgoed}
                    leftIcon={<Checkbox checked={allVastgoedChecked} onTouchTap={this.selectAllVastgoedLayers} iconStyle={{fill:'white'}} />}
                    rightIcon={<ArrowDropRight style={{fill:'white'}} />}
                    menuItems={[
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.teKoop} map={this.props.map} updateParent={this.setAllVastgoedChecked} updateLegenda={this.props.updateLegenda} />,
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.teHuur} map={this.props.map} updateParent={this.setAllVastgoedChecked} updateLegenda={this.props.updateLegenda} />
                    ]}
                />
                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.kavels} map={this.props.map} updateLegenda={this.props.updateLegenda} />
                <MenuItem className='list-item' primaryText={Meteor.settings.public.kvkBedrijven.naam}
                    leftIcon={<Checkbox checked={allKvkChecked} onTouchTap={this.selectAllKvkLayers} iconStyle={{fill:'white'}} />}
                    rightIcon={<ArrowDropRight style={{fill:'white'}} />}
                    menuItems={<BedrijvenBranche map={this.props.map} updateParent={this.setAllKvkChecked} updateLegenda={this.props.updateLegenda} />}
                />
                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.milieu} map={this.props.map} updateLegenda={this.props.updateLegenda} />
                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.ibis} map={this.props.map} updateLegenda={this.props.updateLegenda} />
                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.kadastralePercelen} map={this.props.map} updateLegenda={this.props.updateLegenda} />
                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.luchtfoto} map={this.props.map} updateLegenda={this.props.updateLegenda} />
            </List>
        );
    }
}