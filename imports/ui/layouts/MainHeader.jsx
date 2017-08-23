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
                    <a href="http://www.rijssen-holten.nl/home">
                        <img src={'/images/logo-rh.jpg'} alt="startpagina Gemeente Rijssen-Holten" />
                    </a>
                    <a href="https://www.idgis.nl/nl/">
                        <img src="/images/logoidgisklein.jpg" alt="pagina Idgis" style={styles.image} />
                    </a>
                </div>
            </div>
        );
    }
}