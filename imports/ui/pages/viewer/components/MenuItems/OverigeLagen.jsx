import React, { Component } from 'react';

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class OverigeLagen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            achtergrondkaartenOpen: false,
            bagLigplaatsVisible: false,
            bagPandVisible: false,
            bagStandplaatsVisible: false,
            bagVerblijfsobjectVisible: false,
            ibisVisible: false,
            kvkVisible: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            kvkVisible: nextProps.kvkVisible
        });
    }

    /**
     * Opens the Achtergrondkaarten menu item
     */
    openAchtergrondKaarten = (evt) => {
        this.setState({
            achtergrondkaartenOpen: true,
            anchorEl: evt.currentTarget
        });
    }

    /**
     * Closes the Achtergrondkaarten menu item
     */
    closeAchtergrondKaarten = () => {
        this.setState({
            achtergrondkaartenOpen: false
        });
    }

    /**
     * Turns the BAG Ligplaats layer on and off
     */
    toggleBagLigplaatsLayer = (event, l) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'BAG Ligplaats') {
                let newVisible = (!layer.getVisible());
                this.setState({
                    bagLigplaatsVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    /**
     * Turns the BAG Pand layer on and off
     */
    toggleBagPandLayer = (event, l) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'BAG Pand') {
                let newVisible = (!layer.getVisible());
                this.setState({
                    bagPandVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    /**
     * Turn the BAG Standplaats layer on and off
     */
    toggleBagStandplaatsLayer = (event, l) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'BAG Standplaats') {
                let newVisible = (!layer.getVisible());
                this.setState({
                    bagStandplaatsVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    /**
     * Turns the BAG Verblijfsobject layer on and off
     */
    toggleBagVerblijfsobjectLayer = (event, l) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'BAG Verblijfsobject') {
                let newVisible = (!layer.getVisible());
                this.setState({
                    bagVerblijfsobjectVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    /**
     * Turns all BAG layers on and off at once
     */
    selectAllBagLayers = (event, l) => {
        let layersVisible = !(this.state.bagLigplaatsVisible && this.state.bagPandVisible && this.state.bagStandplaatsVisible
                        && this.state.bagVerblijfsobjectVisible);
        
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'BAG Ligplaats' || layer.get('title') === 'BAG Pand' || layer.get('title') === 'BAG Standplaats' ||
            layer.get('title') === 'BAG Verblijfsobject') {
                this.setState({
                    bagLigplaatsVisible: layersVisible,
                    bagPandVisible: layersVisible,
                    bagStandplaatsVisible: layersVisible,
                    bagVerblijfsobjectVisible: layersVisible
                });
                layer.setVisible(layersVisible);
            }
        });
    }

    /**
     * Turns the IBIS Bedrijventerreinen layer on and off
     */
    toggleIbisLayer = (event, l) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'Ibis Bedrijventerreinen') {
                let newVisible = (!layer.getVisible());
                this.setState({
                    ibisVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    toggleKvkLayer = (event, l) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'Kvk Bedrijven') {
                let newVisible = (!this.props.kvkVisible);
                this.props.setKvkVisible(newVisible);
                layer.setVisible(newVisible);
            }
        });
    }

    render() {
        return (
            <div>
                <ListItem primaryText="Overige Lagen" onClick={this.openAchtergrondKaarten} />
                <Popover
                    open={this.state.achtergrondkaartenOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeAchtergrondKaarten}
                    animation={PopoverAnimationVertical}
                >
                    <List>
                        <MenuItem primaryText='BAG' 
                            leftIcon={<Checkbox checked={this.state.bagLigplaatsVisible && this.state.bagPandVisible && this.state.bagStandplaatsVisible
                                                        && this.state.bagVerblijfsobjectVisible} onClick={this.selectAllBagLayers} />} 
                            rightIcon={<ArrowDropRight />} 
                            menuItems={[
                                <ListItem primaryText='BAG Ligplaats' leftCheckbox={<Checkbox checked={this.state.bagLigplaatsVisible} onClick={this.toggleBagLigplaatsLayer} />} />,
                                <ListItem primaryText='BAG Pand' leftCheckbox={<Checkbox checked={this.state.bagPandVisible} onClick={this.toggleBagPandLayer} />} />,
                                <ListItem primaryText='BAG Standplaats' leftCheckbox={<Checkbox checked={this.state.bagStandplaatsVisible} onClick={this.toggleBagStandplaatsLayer} />} />,
                                <ListItem primaryText='BAG Verblijfsobjecten' leftCheckbox={<Checkbox checked={this.state.bagVerblijfsobjectVisible} onClick={this.toggleBagVerblijfsobjectLayer} />} />
                            ]} 
                        />
                        <ListItem primaryText='Ibis Bedrijventerreinen' leftCheckbox={<Checkbox checked={this.state.ibisVisible} onClick={this.toggleIbisLayer} />} />
                        <ListItem primaryText='KVK Bedrijven' leftCheckbox={<Checkbox checked={this.state.kvkVisible} onClick={this.toggleKvkLayer} />} />
                    </List>
                </Popover>
            </div>
        );
    }
}