import React, { Component } from 'react';

import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class BedrijvenSorted extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bedrijvenIndexAZOpen: false,
            alleBedrijvenSorted: this.props.searchFields.sort()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            alleBedrijvenSorted: nextProps.searchFields.sort()
        });
    }

    /**
     * Opens the Bedrijvenindex (A t/m Z) menu
     */
    openBedrijvenIndexAZ = (evt) => {
        this.setState({
            bedrijvenIndexAZOpen: true,
            anchorEl: evt.currentTarget
        });
    }

    /**
     * Closes the Bedrijvenindex (A t/m Z) menu
     */
    closeBedrijvenIndexAZ = () => {
        this.setState({
            bedrijvenIndexAZOpen: false
        });
    }
    
    /**
     * Get the Bedrijf that was clicked from the list and zoom in and center to it.
     */
    getClickedBedrijf = (event) => {
        console.log(event.target.textContent);
        this.props.selectFeature(event.target.textContent);
    }

    render() {
        const bedrijven = this.state.alleBedrijvenSorted.map((val, i) =>
            <ListItem primaryText={val} key={i} onClick={this.getClickedBedrijf} />
        );

        return(
            <div>
                <ListItem primaryText="Bedrijvenindex (A t/m Z)" onClick={this.openBedrijvenIndexAZ} />
                <Popover
                    open={this.state.bedrijvenIndexAZOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeBedrijvenIndexAZ}
                    animation={PopoverAnimationVertical}
                >
                    <List>
                        {bedrijven}
                    </List>
                </Popover>
            </div>
        );
    }
}