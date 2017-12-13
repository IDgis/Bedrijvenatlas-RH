import React, { Component } from 'react';
import * as ol from 'openlayers';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


export default class KavelInfoPopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: props.map,
            coords: props.coords,
            popupText: null,
            infoButton: <div></div>
        }
    }

    componentDidMount = () => {
        let map = this.props.map;
        let coords = this.props.coords;
        let layer = this.props.layer;
        let title = this.props.title;
        let viewResolution = map.getView().getResolution();
        let wmsSource = new ol.source.TileWMS({
            url: Meteor.settings.public.bedrijvenatlasWmsUrl,
            params: {
                'FORMAT': 'image/png',
                'LAYERS': 'Bedrijventerreinen_uitgiftelocaties',
                'CRS': 'EPSG:28992'
            }
        });
        let url = wmsSource.getGetFeatureInfoUrl(coords, viewResolution, 'EPSG:28992', {'INFO_FORMAT':'application/json'});

        Meteor.call('getFeatureInfo', url, title, (err, result) => {
            if(err) {
                console.log(err);
                this.setState({popupText: null});
            }
            if(result !== null && result !== undefined) {
                let returnField = this.getPopupFields(result);
                let infoButton = <div><RaisedButton href={result[1][result[1].length-1]} target='_blank' label='Meer informatie' /><br /></div>;
                this.setState({popupText: returnField, infoButton: infoButton});
            } else {
                this.setState({popupText: null, infoButton: <div></div>});
            }
        });
    }

    getPopupFields = (fields) => {
        let res = [];
        for(i in fields[0]) {
            if(i < fields[0].length-1) {
                res.push(
                    <tr key={i}>
                        <td style={{width:'100px'}} ><b>{fields[0][i]}:</b></td>
                        <td style={{width:'350px'}} >{fields[1][i]}</td>
                    </tr>   
                );
            }
        }
        return res;
    }

    render() {
        const width = 500;
        const left = (window.innerWidth/2)-(width/2);
        if(this.state.popupText !== null) {
            return(
                <Paper className='valid' style={{position:'absolute', width:width, top:'20px', left:left, borderRadius:5, backgroundColor:Meteor.settings.public.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                    <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{this.props.title}</u></h3>
                        <table><tbody>{this.state.popupText}</tbody></table> <br />
                        {this.state.infoButton}
                        <br />
                    </div>
                </Paper>
            );
        }
        else {
            return (
                <Paper className='valid' style={{position:'absolute', width:width, top:'20px', left:left, borderRadius:5, backgroundColor:Meteor.settings.public.colorGemeente, opacity:0.8, color:'white'}} zDepth={5} >
                    <RaisedButton className='popup-close-button' label='X' onTouchTap={this.props.onRequestClose} />
                    <div style={{position:'relative', left:'20px'}}><br />
                        <h3><u>{this.props.title}</u></h3>
                        <table><tbody><tr><td>Klik in een laag voor meer info...</td></tr></tbody></table> <br />
                        <br />
                    </div>
                </Paper>
            );
        }
    }
}