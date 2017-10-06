import React, { Component } from 'react';


export default class MenuBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className='menu-bar' style={{backgroundColor:Meteor.settings.public.colorGemeente}} >
                <div className='logo-rh' >
                    <a href={Meteor.settings.public.homePageGemeente} target='_blank' >
                        <img style={{height:'56px'}} src={Meteor.settings.public.logoUrlGemeente} alt='logo Gemeente Rijssen-Holten' />
                    </a>
                </div>
                Bedrijvenatlas
                <div className='logo-idgis' >
                    <a href={Meteor.settings.public.homePageIdgis} target='_blank' >
                        <img style={{height:'56px'}} src={Meteor.settings.public.logoUrlIdgis} alt='logo Idgis' />
                    </a>
                </div>
            </div>
        );
    }
}