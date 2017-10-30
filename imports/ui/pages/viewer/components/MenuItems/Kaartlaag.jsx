import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';

export default class Kaartlaag extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            map: this.props.map
        }

        this.setVisibility();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            map: nextProps.map
        });
        this.setVisibility();
    }

    setVisibility() {
        let map = this.props.map;
        let layers = map.getLayers();
        let allSameNameVisible = true;
        layers.forEach((layer, index) => {
            if(layer.get('title') === this.props.primaryText) {
                allSameNameVisible = allSameNameVisible && layer.getVisible();
            }
        });
        layers.forEach((layer, index) => {
            if(layer.get('title') === this.props.primaryText) {
                this.state.visible = allSameNameVisible;
            }
        });
    }

    toggleLayer = (event) => {
        let map = this.props.map;
        let layers = map.getLayers();
        let allSameNameVisible = true;
        layers.forEach((layer, index) => {
            if(layer.get('title') === this.props.primaryText) {
                allSameNameVisible = allSameNameVisible && layer.getVisible();
            }
        });
        layers.forEach((layer, index) => {
            if(layer.get('title') === this.props.primaryText) {
                let newVisible = !allSameNameVisible;
                this.setState({
                    visible: newVisible
                });
                layer.setVisible(newVisible);
            }
            if(this.props.updateParent !== undefined) {
                this.props.updateParent();
            }
        });
    }

    render() {
        if(this.props.primaryText === Meteor.settings.public.laagNaam.teKoop) {
            return(
                <ListItem className='list-item' primaryText={this.props.primaryText} 
                    leftCheckbox={<Checkbox checked={this.state.visible} onClick={this.toggleLayer} iconStyle={{fill:'white'}} />} 
                    rightIcon={<Avatar src={Meteor.settings.public.iconKoop} />}
                />
            );
        }
        else if(this.props.primaryText === Meteor.settings.public.laagNaam.teHuur) {
            return(
                <ListItem className='list-item' primaryText={this.props.primaryText} 
                    leftCheckbox={<Checkbox checked={this.state.visible} onClick={this.toggleLayer} iconStyle={{fill:'white'}} />} 
                    rightIcon={<Avatar src={Meteor.settings.public.iconHuur} />}
                />
            );
        }
        else
            return (
                <ListItem className='list-item' primaryText={this.props.primaryText} leftCheckbox={<Checkbox checked={this.state.visible} onClick={this.toggleLayer} iconStyle={{fill:'white'}} />} />
            );
    }
}