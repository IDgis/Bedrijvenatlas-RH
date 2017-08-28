import React, { Component } from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import {List, ListItem} from 'material-ui/List';

export default class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return(
            <ListItem>
                <AutoComplete
                    floatingLabelText="Type hier om te zoeken"
                    dataSource={this.props.dataSource}
                    filter={AutoComplete.caseInsensitiveFilter}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onNewRequest={this.props.onNewRequest}
                    maxSearchResults={10}
                />
            </ListItem>
        );
    }
}