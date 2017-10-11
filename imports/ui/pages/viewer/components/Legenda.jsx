import React, { Component } from 'react';

const style = {
    position: 'fixed',
    top: '124px',
    right: '10px',
    height: '150px',
    zIndex: 2,
    borderRadius: '5px'
}

export default class Legenda extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            milieuLegenda: null,
            kavelsLegenda: null
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            map: nextProps.map
        });
        this.getLegenda(nextProps.map);
    }

    getLegenda = (map) => {
        if(map !== null) {
            let layers = map.getLayers();
            layers.forEach((layer, index) => {
                if(layer.get('title') === Meteor.settings.public.laagNaam.milieu) {
                    if(layer.getVisible()) {
                        this.setState({
                            milieuLegenda: <img className='legenda-milieu' src='https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_RO_categorie_indeling_service/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Bedrijventerreinen_RO_categorie_indeling' />
                        });
                    } else {
                        this.setState({milieuLegenda: null});
                    }
                }
                if(layer.get('title') === Meteor.settings.public.laagNaam.kavels) {
                    if(layer.getVisible()) {
                        this.setState({
                            kavelsLegenda: <img className='legenda-kavels' src='https://rijssenholten.geopublisher.nl/staging/geoserver/Bedrijventerreinen_uitgifte_kavels_service/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Bedrijventerreinen_uitgifte_kavels' />
                        });
                    } else {
                        this.setState({kavelsLegenda: null});
                    }
                }
            });
        }
    }

    render() {
        let milieuLegenda = this.state.milieuLegenda;
        let kavelsLegenda = this.state.kavelsLegenda;
        
        if(milieuLegenda === null && kavelsLegenda === null) {
            return(
                <div className='legenda'></div>
            );
        } else {
            return(
                <div className='legenda'>
                    {kavelsLegenda}
                    {milieuLegenda}
                </div>
            );
        }
    }
}