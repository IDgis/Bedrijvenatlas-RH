import React, { Component } from 'react';

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
        layers.forEach((layer, index) => {
            if(layer.get('title') === this.props.primaryText) {
                this.state.visible = layer.getVisible();
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
        return (
            <ListItem primaryText={this.props.primaryText} leftCheckbox={<Checkbox checked={this.state.visible} onClick={this.toggleLayer} />} />
        );
    }
}