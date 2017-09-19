import React, { Component } from 'react';
import { GeoCoder } from 'geo-coder';
import * as ol from 'openlayers';

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class Vastgoed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            vastgoedMenuOpen: false,
            teKoopOpen: false,
            teKoopVisible: false,
            teHuurOpen: false,
            teHuurVisible: false,
            anchorEl: null,
            xhr: new XMLHttpRequest()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.map !== null) {
            let layers = nextProps.map.getLayers();
            layers.forEach((layer, index, arr) => {
                if(layer.get('title') === Meteor.settings.public.laagNaam.teKoop) {
                    this.setState({
                        teKoopVisible: layer.getVisible()
                    });
                }
                if(layer.get('title') === Meteor.settings.public.laagNaam.teHuur) {
                    this.setState({
                        teHuurVisible: layer.getVisible()
                    });
                }
            });
        }
    }

    openVastgoedMenu = (event) => {
        this.setState({
            vastgoedMenuOpen: true,
            anchorEl: event.currentTarget
        });
    }

    closeVastgoedMenu = () => {
        this.setState({
            vastgoedMenuOpen: false
        });
    }

    selectAllTeKoop = (event) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === Meteor.settings.public.laagNaam.teKoop) {
                let newVisible = (!this.state.teKoopVisible);
                this.setState({
                    teKoopVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    selectAllTeHuur = (event) => {
        let layers = this.props.map.getLayers();
        layers.forEach((layer, index) => {
            if(layer.get('title') === Meteor.settings.public.laagNaam.teHuur) {
                let newVisible = (!this.state.teHuurVisible);
                this.setState({
                    teHuurVisible: newVisible
                });
                layer.setVisible(newVisible);
            }
        });
    }

    openTeKoop = (event) => {
        this.setState({
            teKoopOpen: true
        });
    }

    openTeHuur = (event) => {
        this.setState({
            teHuurOpen: true
        });
    }

    closeTeKoop = () => {
        this.setState({
            teKoopOpen: false
        });
    }

    closeTeHuur = () => {
        this.setState({
            teHuurOpen: false
        });
    }

    processRequest = (evt) => {
        //console.log(this.state.xhr.status);
        if(this.state.xhr.readyState == 4 && this.state.xhr.status == 200) {
            //console.log(this.state.xhr.responseXML.getElementsByTagName('gml:pos')[0].textContent);
        }
    }

    render() {
        /*if(this.props.map !== null) {
            this.props.map.getView().setCenter([232257.385, 480792.271]);
            //this.props.map.getView().setCenter([198557.0, 489289.0]);
        }*/

        //this.state.xhr.open('GET', 'http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?zoekterm=boomkamp 16 rijssen', true);
        //this.state.xhr.open('GET', 'https://www.fundainbusiness.nl/', true);
        //this.state.xhr.setRequestHeader('Acces-Control-Allow-Origin', '/**');
        //this.state.xhr.send();
        //this.state.xhr.addEventListener('readystatechange', this.processRequest, false);

        /*let geoCoder = new GeoCoder({
            provider: 'osm',
            key: ''
        });
        geoCoder.geocode('Boomkamp 16, Rijssen').then(result => {
            let res = result[0];
            if(this.props.map !== null) {
                this.props.map.getView().setCenter(ol.proj.transform([res['lon'], res['lat']], 'EPSG:4326', 'EPSG:28992'));
            }
        });*/
        //console.log(ol.proj.transform([727000, 6855500], 'EPSG:3857', 'EPSG:28992'));

        return(
            <div>
                <MenuItem primaryText="Vastgoedinformatie" onClick={this.openVastgoedMenu} />
                <Popover
                    open={this.state.vastgoedMenuOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeVastgoedMenu}
                    animation={PopoverAnimationVertical}
                >
                    <Menu>
                        <MenuItem 
                            primaryText={Meteor.settings.public.laagNaam.teKoop}
                            onClick={this.selectAllTeKoop}
                            leftIcon={<Checkbox checked={this.state.teKoopVisible} /*onClick={this.selectAllTeKoop}*/ />}
                        />
                        {/*<Popover
                            open={this.state.teKoopOpen}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.closeTeKoop}
                            animation={PopoverAnimationVertical}
                        >
                            <MenuItem primaryText='tekooptest_1' onClick={this.zoomToSelected} />
                        </Popover>
                        <MenuItem 
                            primaryText='Te huur' 
                            onClick={this.openTeHuur}
                            leftIcon={<Checkbox checked={false} onClick={this.selectAllTeHuur} />}
                            rightIcon={<ArrowDropRight />}
                        />
                        <Popover
                            open={this.state.teHuurOpen}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.closeTeHuur}
                            animation={PopoverAnimationVertical}
                        >
                            <MenuItem primaryText='tehuurtest_1' onClick={this.zoomToSelected} />
                            <MenuItem primaryText='tehuurtest_2' onClick={this.zoomToSelected} />
                            <MenuItem primaryText='tehuurtest_3' onClick={this.zoomToSelected} />
                        </Popover>*/}
                    </Menu>
                </Popover>
            </div>
        );
    }
}