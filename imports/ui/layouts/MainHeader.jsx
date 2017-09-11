import React, { Component } from 'react';

const styles = {
    position: 'relative',
    backgroundColor: '#fff',
    height: '56px',
    width: '100%',
    left: 5,
    image: {
        position: 'absolute',
        height: '56px',
        width: 'auto',
        right: 10
    }
}

export default class MainHeader extends Component {

    render() {
        return (
            <div style={styles}>
                <div className="col-xs-12 col-sm-12">
                    <a href={Meteor.settings.public.homePageGemeente}>
                        <img src={Meteor.settings.public.logoUrlGemeente} alt="startpagina Gemeente Rijssen-Holten" />
                    </a>
                    <a href={Meteor.settings.public.homePageIdgis}>
                        <img src={Meteor.settings.public.logoUrlIdgis} alt="pagina Idgis" style={styles.image} />
                    </a>
                </div>
            </div>
        );
    }
}