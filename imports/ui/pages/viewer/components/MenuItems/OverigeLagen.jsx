import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import Bedrijvenlaag from './Bedrijvenlaag';
import Kaartlaag from './Kaartlaag';
import ListItem from './ListItem';
import ListItemMenu from './ListItemMenu';

export default class OverigeLagen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            allKvkChecked: false,
            allDetailHandelChecked: false,
            allVastgoedChecked: false,
            listItemMenu: null,
            selectedItem: null
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

    selectAllDetailHandelLayers = (event, l) => {
        let newVisible = !this.state.allDetailHandelChecked;
        let detailHandel = Meteor.settings.public.detailHandel.naam;
        let map = this.props.map;

        if (map != null) {
            let layers = map.getLayers();
            layers.forEach(layer => {
                if (layer.get('title') === detailHandel) {
                    layer.setVisible(newVisible);
                }
            });
        }

        this.setState({
            allDetailHandelChecked: newVisible
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

    setAllDetailHandelChecked = () => {
        const detailHandel = Meteor.settings.public.detailHandel.naam;
        const map = this.props.map;

        if (map != null) {
            let allVisible = true;
            const layers = map.getLayers();
            layers.forEach(layer => {
                if (layer.get('title') === detailHandel) {
                    allVisible = allVisible && layer.getVisible();
                }
            });

            this.setState({
                allDetailHandelChecked: allVisible
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
     * Get the visibility of all KVK and Detailhandel layers
     */
    getAllLayerGroupChecked = (layerGroupName) => {
        const map = this.props.map;
        let visible = false;

        if (map !== null) {
            let layers = map.getLayers();
            layers.forEach(layer => {
                if (layer.get('title') === layerGroupName) {
                    if (layer.getVisible()) {
                        visible = true;
                    }
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

    toggleSubmenu = (e, items) => {
        console.log(e.currentTarget);
        const rect = e.currentTarget.getBoundingClientRect();

        const selectedItem = rect.top;
        const listItemMenu = <ListItemMenu items={items} top={rect.top} left={rect.right} />;

        if (this.state.selectedItem === selectedItem) {
            this.setState({
                selectedItem: null,
                listItemMenu: null
            });
        } else {
            this.setState({
                selectedItem: rect.top,
                listItemMenu
            });
        }
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        const allVastgoedChecked = this.getAllVastgoedChecked();
        const allKvkChecked = this.getAllLayerGroupChecked(Meteor.settings.public.kvkBedrijven.naam);
        const allDetailHandelChecked = this.getAllLayerGroupChecked(Meteor.settings.public.detailHandel.naam);

        const fundaMenuItems = this.getFundaMenuItems();
        const customLayers = this.getCustomLayers();
        const { listItemMenu } = this.state;

        return (
            <div className='list-menu' style={{padding:'8px 0px'}} >
                <ListItem 
                    primaryText='Te Koop/Huur' 
                    isChecked={allVastgoedChecked}
                    selectAll={this.selectAllVastgoedLayers}
                    items={fundaMenuItems}
                    onClick={this.toggleSubmenu}
                    />
                <ListItem 
                    primaryText={Meteor.settings.public.kvkBedrijven.naam} 
                    isChecked={allKvkChecked}
                    selectAll={this.selectAllKvkLayers}
                    items={<Bedrijvenlaag 
                        layer={Meteor.settings.public.kvkBedrijven} 
                        map={this.props.map} 
                        updateParent={this.setAllKvkChecked} 
                        updateLegenda={this.props.updateLegenda} />}
                    onClick={this.toggleSubmenu}
                    />
                <ListItem 
                    primaryText={Meteor.settings.public.detailHandel.naam} 
                    isChecked={allDetailHandelChecked}
                    selectAll={this.selectAllDetailHandelLayers}
                    items={<Bedrijvenlaag
                        layer={Meteor.settings.public.detailHandel}
                        map={this.props.map}
                        updateParent={this.setAllDetailHandelChecked}
                        updateLegenda={this.props.updateLegenda} />}
                    onClick={this.toggleSubmenu}
                    />
                { customLayers }
                { listItemMenu }
            </div>
        );
    }
}