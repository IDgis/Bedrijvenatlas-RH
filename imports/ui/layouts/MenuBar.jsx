import React, { Component } from 'react';


export default class MenuBar extends Component {

    constructor(props) {
        super(props);
    }

    customStyle = {
        position: 'fixed',
        backgroundColor: Meteor.settings.public.colorGemeente,
        width: '100%',
        height: '56px',
        fontSize: '40px',
        color: 'white',
        textAlign: 'center'
    }

    render() {
        return(
            <div style={this.customStyle} >
                <div style={{position:'fixed', top:'0px', left:'0px'}} >
                    <a href={Meteor.settings.public.homePageGemeente} target='_blank' >
                        <img style={{height:'56px'}} src={Meteor.settings.public.logoUrlGemeente} alt='logo Gemeente Rijssen-Holten' />
                    </a>
                </div>
                Bedrijvenatlas
                <div style={{position:'fixed', top:'0px', right:'0px'}} >
                    <a href={Meteor.settings.public.homePageIdgis} target='_blank' >
                        <img style={{height:'56px'}} src={Meteor.settings.public.logoUrlIdgis} alt='logo Idgis' />
                    </a>
                </div>
            </div>
        );
    }
}