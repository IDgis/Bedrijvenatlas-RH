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
        layers.forEach(layer => {
            if(layer.get('title') === this.props.layer.titel) {
                allSameNameVisible = allSameNameVisible && layer.getVisible();
            }
        });
        layers.forEach(layer => {
            if(layer.get('title') === this.props.layer.titel) {
                this.state.visible = allSameNameVisible;
            }
        });
    }

    toggleLayer = () => {
        let map = this.props.map;
        let layers = map.getLayers();
        let allSameNameVisible = true;
        layers.forEach(layer => {
            if(layer.get('title') === this.props.layer.titel) {
                allSameNameVisible = allSameNameVisible && layer.getVisible();
            }
        });
        layers.forEach(layer => {
            if(layer.get('title') === this.props.layer.titel) {
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
        this.props.updateLegenda();
    }

    render() {
        const iconAvailable = this.props.layer.icon !== undefined;

        return (
            <ListItem className='list-item'
                primaryText={<div>{this.props.layer.titel} <span title={this.props.layer.omschrijving} className="glyphicon glyphicon-info-sign text-primary" ></span></div>}
                leftCheckbox={<Checkbox checked={this.state.visible} onClick={this.toggleLayer} iconStyle={{fill:'white'}} />}
                rightIcon={iconAvailable ? <Avatar src={this.props.layer.icon} /> : null}
                />
        );
    }
}