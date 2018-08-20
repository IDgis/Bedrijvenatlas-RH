import React, { Component } from 'react';


export default class MenuBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className='menu-bar' style={{backgroundColor:Meteor.settings.public.gemeenteConfig.colorGemeente}} >
                <div className='logo-rh' >
                    <a href={Meteor.settings.public.gemeenteConfig.homePage} target='_blank' >
                        <img style={{height:'56px'}} src={Meteor.settings.public.gemeenteConfig.logo} alt='logo Gemeente Rijssen-Holten' />
                    </a>
                </div>
                Bedrijvenatlas
                <div className='logo-idgis' >
                    <a href={Meteor.settings.public.idgisConfig.homePage} target='_blank' >
                        <img style={{height:'56px'}} src={Meteor.settings.public.idgisConfig.logo} alt='logo Idgis' />
                    </a>
                </div>
            </div>
        );
    }
}