import React, { Component } from 'react';

import {List, ListItem} from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class BedrijvenSorted extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bedrijvenIndexAZOpen: false,
            alleBedrijvenSorted: [],
            letters: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            showLetters: true
        }
    }

    /**
     * Sort all bedrijven with the given letter by name 
     */
    setBedrijvenSorted(letter) {
        console.log('Filling index sorted...');

        Meteor.call('sortKvkBedrijven', (error, result) => {
            let names = [];
            for(let i = 0; i < result.length; i++) {
                let res = result[i];
                if(letter !== '#' && res['KVK_HANDELSNAAM'].startsWith(letter)) {
                    names.push(res['KVK_HANDELSNAAM']);
                }
                if(letter === '#' && !/^[a-zA-Z]/.test(res['KVK_HANDELSNAAM'])) {
                    names.push(res['KVK_HANDELSNAAM']);
                }
            }
            
            this.setState({
                alleBedrijvenSorted: names
            });

            console.log('Sorted Bedrijvenindex by name...');
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
            bedrijvenIndexAZOpen: false,
            showLetters: true,
            alleBedrijvenSorted: []
        });
    }
    
    /**
     * Get the Bedrijf that was clicked from the list and zoom in and center to it.
     */
    getClickedBedrijf = (event) => {
        this.props.selectFeature(event.target.textContent);
        this.setState({
            bedrijvenIndexAZOpen: false,
            showLetters: true,
            alleBedrijvenSorted: []
        });
    }

    /**
     * Set the letter that was clicked in the menu so the sorted submenu can be opened
     */
    setClickedLetter = (event) => {
        this.setState({
            showLetters: false,
        });
        this.setBedrijvenSorted(event.target.textContent);
    }

    render() {
        const lettersMenu = this.state.letters.map((val, i) =>
            <MenuItem primaryText={val} key={i} onClick={this.setClickedLetter} />
        );

        let namesMenu = this.state.alleBedrijvenSorted.map((val, i) =>
            <ListItem primaryText={val} key={i} onClick={this.getClickedBedrijf} open={this.state.bedrijvenIndexAZOpen} />
        );

        return(
            <div>
                <MenuItem primaryText="Bedrijvenindex (A t/m Z)" onClick={this.openBedrijvenIndexAZ} />
                <Popover
                    open={this.state.bedrijvenIndexAZOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeBedrijvenIndexAZ}
                    animation={PopoverAnimationVertical}
                >
                    <Menu style={{width: '250px'}}>
                        {this.state.showLetters ? lettersMenu : namesMenu}
                    </Menu>
                </Popover>
            </div>
        );
    }
}