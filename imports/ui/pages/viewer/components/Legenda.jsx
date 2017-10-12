import React, { Component } from 'react';


export default class Legenda extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            milieuLegenda: null
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
            });
        }
    }

    render() {
        let milieuLegenda = this.state.milieuLegenda;
        
        if(milieuLegenda === null) {
            return(
                <div style={{display:'none'}} ></div>
            );
        } else {
            return(
                <div className='legenda'>
                    {milieuLegenda}
                </div>
            );
        }
    }
}