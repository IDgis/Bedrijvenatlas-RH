import React, { Component } from 'react';

import {List, ListItem} from 'material-ui/List';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class BedrijvenBranche extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return(
            <div>
                <ListItem primaryText="Bedrijvenindex (naar branche)" />
                <Popover></Popover>
            </div>
        );
    }
}