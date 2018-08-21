import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';

export default class Bedrijvenlaag extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: props.map,
            menuOpen: false
        }

        this.setDefaultVisibility();
        this.updateVisibility();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            map: nextProps.map
        });
        
        this.updateVisibility();
    }

    setDefaultVisibility = () => {
        Object.keys(this.props.layer.icons).forEach(category => {
            this.state[category] = false;
        });
    }

    updateVisibility = () => {
        const map = this.state.map;
        if (map !== null) {
            map.getLayers().forEach(layer => {
                if (layer.get('title') === this.props.layer.naam) {
                    const source = layer.getSource();
                    if (source.getState() === 'ready') {
                        const features = source.getFeatures();
                        const category = features[0].get('SBI_RUBR_C');
                        this.state[category] = layer.getVisible();
                    }
                }
            });
        }
    }

    /**
     * Show the icons of the selected branche on the map
     */
    selectBranche = (event) => {
        const clickedCategory = event.target.value;
        const map = this.state.map;

        if (map !== null) {
            map.getLayers().forEach(layer => {
                if (layer.get('title') === this.props.layer.naam) {
                    const source = layer.getSource();
                    if (source.getState() === 'ready') {
                        const features = source.getFeatures();
                        const category = features[0].get('SBI_RUBR_C');
                        if (category === clickedCategory) {
                            layer.setVisible(!layer.getVisible());
                            this.state[category] = layer.getVisible();
                        }
                    }
                }

                if (this.props.updateParent !== undefined) {
                    this.props.updateParent();
                }
            });
            
            this.props.updateLegenda();
        }
    }

    render() {
        return(
            <List>
            {
                Object.keys(this.props.layer.icons).map((category, i) => (
                    <ListItem className='list-item' primaryText={this.props.layer.namen[category]}
                        leftIcon={<Checkbox checked={this.state[category]} onClick={this.selectBranche} value={category} iconStyle={{fill:'white'}} />}
                        rightIcon={<Avatar src={this.props.layer.icons[category]} />}
                        key={category + i}
                        />
                ))
            }
            </List>
        );
    }
}