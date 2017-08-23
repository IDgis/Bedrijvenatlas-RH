import React, { Component } from 'react';
import * as ol from 'openlayers';

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Subheader from 'material-ui/Subheader';

export default class LayerMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            achtergrondkaartenOpen: false,
            searchFields: [],
            bagLigplaatsVisible: false,
            bagPandVisible: false,
            bagStandplaatsVisible: false,
            bagVerblijfsobjectVisible: false,
            bagWoonplaatsVisible: false,
            ibisVisible: false,
            kvkVisible: false
        }

        this.fillSearchFields();
    }

    /**
     * Fills the search fields to search for KVK names
     */
    fillSearchFields() {
        console.log('Filling search fields...');
        Meteor.call('getKvkBedrijven', (error, result) => {
            for(let i = 0; i < result.length; i++) {
                let res = result[i];
                this.state.searchFields.push(res['KVK_HANDELSNAAM']);

                let straatnaam = res['KVK_STRAATNAAM'];
                let nameInArr = false;
                for(let j = 0; j < this.state.searchFields.length; j++) {
                    if(this.state.searchFields[j] === straatnaam) {
                        nameInArr = true;
                        break;
                    }
                }
                if(!nameInArr) {
                    this.state.searchFields.push(straatnaam);
                }
            }
        });
        console.log('Search fields filled...');
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
        })
    }

    /**
     * Turns the BAG Ligplaats layer on and off
     */
    toggleBagLigplaatsLayer = () => {
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
    toggleBagPandLayer = () => {
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
    toggleBagStandplaatsLayer = () => {
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
    toggleBagVerblijfsobjectLayer = () => {
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
     * Turns the BAG Woonplaats layer on and off
     */
    toggleBagWoonplaatsLayer = () => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'BAG Woonplaats') {
                let newVisible = (!layer.getVisible());
                this.setState({
                    bagWoonplaatsVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    /**
     * Turns the IBIS Bedrijventerreinen layer on and off
     */
    toggleIbisLayer = () => {
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

    /**
     * Turns the KVK Bedrijven layer on and off
     */
    toggleKvkLayer = () => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'Kvk Bedrijven') {
                let newVisible = (!layer.getVisible());
                this.setState({
                    kvkVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    /**
     * Turns all BAG layers on and off at once
     */
    selectAllBagLayers = () => {
        let layersVisible = !(this.state.bagLigplaatsVisible && this.state.bagPandVisible && this.state.bagStandplaatsVisible
                        && this.state.bagVerblijfsobjectVisible && this.state.bagWoonplaatsVisible);
        
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === 'BAG Ligplaats' || layer.get('title') === 'BAG Pand' || layer.get('title') === 'BAG Standplaats' ||
            layer.get('title') === 'BAG Verblijfsobject' || layer.get('title') === 'BAG Woonplaats') {
                this.setState({
                    bagLigplaatsVisible: layersVisible,
                    bagPandVisible: layersVisible,
                    bagStandplaatsVisible: layersVisible,
                    bagVerblijfsobjectVisible: layersVisible,
                    bagWoonplaatsVisible: layersVisible
                });
                layer.setVisible(layersVisible);
            }
        });
    }

    /**
     * Turns the searched item on and off on the map
     */
    toggleFeature = (searchfield) => {
        console.log('Searching for: ' + searchfield);
        // Zoom to the searched feature on the map

        // Example of how to load data from the layers
        /*let layers = this.state.map.getLayers();
        layers.forEach((ele, index) => {
            if(ele.get('title') === 'Kvk Bedrijven') {
                let props = ele.getProperties();
                ele.getSource().on('change', (e) => {
                    let source = e.target;
                    if(source.getState() === 'ready') {
                        let feats = source.getFeatures();
                        console.log((feats[3]).get('KVK_HANDELSNAAM'));
                    }
                });
            }
        });*/
    }

    /**
     * Renders the object to the screen
     */
    render() {
        return (
            <Drawer open={this.props.openMenu} openSecondary={true}>
                <Menu>
                    <ListItem>
                        <AutoComplete
                            floatingLabelText="Type hier om te zoeken"
                            dataSource={this.state.searchFields}
                            filter={AutoComplete.caseInsensitiveFilter}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            onNewRequest={this.toggleFeature}
                            maxSearchResults={10}
                        />
                    </ListItem>

                    <ListItem primaryText="Bedrijvenindex (A t/m Z)" />
                    <Popover></Popover>

                    <ListItem primaryText="Bedrijvenindex (naar branche)" />
                    <Popover></Popover>

                    <ListItem primaryText="Overige Lagen" onClick={this.openAchtergrondKaarten} />
                    <Popover
                        open={this.state.achtergrondkaartenOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        onRequestClose={this.closeAchtergrondKaarten}
                        animation={PopoverAnimationVertical}
                    >
                        <List>
                            <MenuItem primaryText='BAG' 
                                leftIcon={<Checkbox checked={this.state.bagLigplaatsVisible && this.state.bagPandVisible && this.state.bagStandplaatsVisible
                                                            && this.state.bagVerblijfsobjectVisible && this.state.bagWoonplaatsVisible} onClick={this.selectAllBagLayers} />} 
                                rightIcon={<ArrowDropRight />} 
                                menuItems={[
                                    <ListItem primaryText='BAG Ligplaats' leftCheckbox={<Checkbox checked={this.state.bagLigplaatsVisible} onClick={this.toggleBagLigplaatsLayer} />} />,
                                    <ListItem primaryText='BAG Pand' leftCheckbox={<Checkbox checked={this.state.bagPandVisible} onClick={this.toggleBagPandLayer} />} />,
                                    <ListItem primaryText='BAG Standplaats' leftCheckbox={<Checkbox checked={this.state.bagStandplaatsVisible} onClick={this.toggleBagStandplaatsLayer} />} />,
                                    <ListItem primaryText='BAG Verblijfsobjecten' leftCheckbox={<Checkbox checked={this.state.bagVerblijfsobjectVisible} onClick={this.toggleBagVerblijfsobjectLayer} />} />,
                                    <ListItem primaryText='BAG Woonplaats' leftCheckbox={<Checkbox checked={this.state.bagWoonplaatsVisible} onClick={this.toggleBagWoonplaatsLayer} />} />
                                ]} 
                            />
                            <ListItem primaryText='Ibis Bedrijventerreinen' leftCheckbox={<Checkbox checked={this.state.ibisVisible} onClick={this.toggleIbisLayer} />} />
                            <ListItem primaryText='KVK Bedrijven' leftCheckbox={<Checkbox checked={this.state.kvkVisible} onClick={this.toggleKvkLayer} />} />
                        </List>
                    </Popover>

                    <ListItem primaryText="Vastgoedinformatie" />
                    <Popover></Popover>
                </Menu>
            </Drawer>
        );
    }
}