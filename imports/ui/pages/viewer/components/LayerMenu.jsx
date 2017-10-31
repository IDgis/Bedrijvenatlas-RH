import React, { Component } from 'react';
import * as ol from 'openlayers';

import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import BedrijvenBranche from './MenuItems/BedrijvenBranche.jsx';
import OverigeLagen from './MenuItems/OverigeLagen.jsx';

export default class LayerMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bedrijvenIndexAZOpen: false,
            kvkVisible: false,
            updateKvk: false,
            menuOpen: this.props.menuOpen
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuOpen: nextProps.menuOpen,
            anchorEl: nextProps.anchorEl
        });
    }

    /**
     * Sets the visibility of the KVK layer to the new value
     */
    setKvkVisible = (newVisible) => {
        this.setState({
            kvkVisible: newVisible
        });
    }

    updateKvkChecked = () => {
        this.setState({
            updateKvk: true
        });
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        if(this.props.map !== null) {
            document.getElementById('map').focus();
        }

        return (
            <Popover
            open={this.props.menuOpen}
            anchorEl={this.props.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.props.closeMenu}
            animation={PopoverAnimationVertical}
            >
                <Menu>
                    <OverigeLagen map={this.props.map} updateLegenda={this.props.updateLegenda} />
                </Menu>
            </Popover>
        );
    }
}