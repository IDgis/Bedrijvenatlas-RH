import React, { Component } from 'react';
import { GeoCoder } from 'geo-coder';
import * as ol from 'openlayers';
import proj4 from 'proj4';

import {List, ListItem} from 'material-ui/List';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

export default class Vastgoed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    render() {
        /*if(this.props.map !== null) {
            this.props.map.getView().setCenter([232257.385, 480792.271]);
            //this.props.map.getView().setCenter([198557.0, 489289.0]);
        }*/

        /*proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs');
        ol.proj.setProj4(proj4);*/
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
                <ListItem primaryText="Vastgoedinformatie" />
                <Popover></Popover>
            </div>
        );
    }
}