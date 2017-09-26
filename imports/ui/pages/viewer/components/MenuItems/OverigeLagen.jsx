import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import Kaartlaag from './Kaartlaag.jsx';

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class OverigeLagen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            allBagChecked: false,
            achtergrondkaartenOpen: false
        }

        this.setAllBagChecked();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            map: nextProps.map,
        });

        this.setAllBagChecked();
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
     * Turns all BAG layers on and off at once
     */
    selectAllBagLayers = (event, l) => {
        let newVisible = !this.state.allBagChecked;

        let bagligplaats = Meteor.settings.public.laagNaam.bagLigplaats;
        let bagpand = Meteor.settings.public.laagNaam.bagPand;
        let bagstandplaats = Meteor.settings.public.laagNaam.bagStandplaats;
        let bagverblijf = Meteor.settings.public.laagNaam.bagVerblijfsobject;

        let map = this.props.map;
        if(map != null) {
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === bagligplaats || layer.get('title') === bagpand || layer.get('title') === bagstandplaats ||
                layer.get('title') === bagverblijf) {
                    layer.setVisible(newVisible);
                }
            });
        }

        this.setState({
            allBagChecked: newVisible
        });
    }

    /**
     * Checks whether all BAG layers are cheched or not and sets its internal state
     */
    setAllBagChecked = () => {
        let bagligplaats = Meteor.settings.public.laagNaam.bagLigplaats;
        let bagpand = Meteor.settings.public.laagNaam.bagPand;
        let bagstandplaats = Meteor.settings.public.laagNaam.bagStandplaats;
        let bagverblijf = Meteor.settings.public.laagNaam.bagVerblijfsobject;

        let map = this.props.map;
        if(map !== null) {
            let allVisible = true;
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === bagligplaats) {
                    if(!layer.getVisible()) allVisible = false;
                } else if(layer.get('title') === bagpand) {
                    if(!layer.getVisible()) allVisible = false;
                } else if(layer.get('title') === bagstandplaats) {
                    if(!layer.getVisible()) allVisible = false;
                } else if(layer.get('title') === bagverblijf) {
                    if(!layer.getVisible()) allVisible = false;
                }

                this.setState({
                    allBagChecked: allVisible
                });
            });
        }
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        return (
            <div>
                <MenuItem primaryText="Overige Lagen" onClick={this.openAchtergrondKaarten} />
                <Popover
                    open={this.state.achtergrondkaartenOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeAchtergrondKaarten}
                    animation={PopoverAnimationVertical}
                >
                    <List>
                        <MenuItem primaryText={Meteor.settings.public.laagNaam.bag}
                            leftIcon={<Checkbox checked={this.state.allBagChecked} onTouchTap={this.selectAllBagLayers} />} 
                            rightIcon={<ArrowDropRight />} 
                            menuItems={[
                                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.bagLigplaats} map={this.props.map} updateParent={this.setAllBagChecked} />,
                                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.bagPand} map={this.props.map} updateParent={this.setAllBagChecked} />,
                                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.bagStandplaats} map={this.props.map} updateParent={this.setAllBagChecked} />,
                                <Kaartlaag primaryText={Meteor.settings.public.laagNaam.bagVerblijfsobject} map={this.props.map} updateParent={this.setAllBagChecked} />
                            ]} 
                        />
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.ibis} map={this.props.map} />
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.kvk} map={this.props.map} updateParent={this.props.updateKvkChecked} />
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.kavels} map={this.props.map} />
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.milieu} map={this.props.map} />
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.kadastralePercelen} map={this.props.map} />
                        <Kaartlaag primaryText={Meteor.settings.public.laagNaam.luchtfoto} map={this.props.map} />
                    </List>
                </Popover>
            </div>
        );
    }
}