import React, { Component } from 'react';

const style = {
    position: 'relative',
    backgroundColor: 'inherit',
    width: '40%',
    height: '500px',
    marginRight: '70px',
    float: 'right',
    a: {
        textDecoration: 'none',
        color: '#000'
    },
    image: {
        position: 'relative',
        top: '10px',
        width: '80%',
        maxWidth: '60%'
    },
    text: {
        position: 'relative',
        bottom: '10px',
        color: '#333'
    }
};

export default class ViewerLink extends Component {

    render() {
        return (
            <a href="/viewer" style={style.a}>
                <div style={style}>
                    <div>
                        <img style={style.image} src="/images/gps_fixed.png" />
                    </div>
                    <div style={style.text}>
                        <h2>Direct naar de viewer</h2>
                    </div>
                </div>
            </a>
        );
    }
}