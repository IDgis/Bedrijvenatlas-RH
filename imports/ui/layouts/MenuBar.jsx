import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    backgroundColor: '#730049',
    title: {
        color: '#fff'
    }
};


export default class MenuBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menuopen: false
        }
    }

    changeOpenState() {
        this.state.menuopen = !this.state.menuopen;
        this.props.setMenuState(this.state.menuopen);
    }

    

    render() {
        return (
            <AppBar 
                title={ <span style={styles.title}>Bedrijvenatlas gemeente Rijssen-Holten</span> }
                iconElementRight={ <FlatButton href="/" label="Naar hoofdscherm" /> }
                onLeftIconButtonTouchTap={this.changeOpenState.bind(this)}
                style={styles}
            />
        );
    }
}