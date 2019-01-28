import React from 'react';

import OverigeLagen from './MenuItems/OverigeLagen';
import { Meteor } from 'meteor/meteor';

const menuStyle = {
    color: 'rgba(0,0,0,0.87)',
    backgroundColor: 'rgb(255,255,255)',
    transition: 'transform 450ms cubic-bezier(0.23,1,0.32,1) 0ms, opacity 450ms cubic-bezier(0.23,1,0.32,1) 0ms',
    boxSizing: 'border-box',
    fontFamily: 'Roboto, sans-serif',
    boxShadow: 'rgba(0,0,0,0.12) 0px 1px 6px, rgba(0,0,0,0.12) 0px 1px 4px',
    borderRadius: '2px',
    position: 'fixed',
    zIndex: '2100',
    opacity: '1',
    transform: 'scaleY(1)',
    transformOrigin: 'left top 0px',
    maxHeight: '966px',
    height: 'auto',
    top: '215px',
    left: '10px'
};

const menuPresentationStyle = {
    zIndex: '1000',
    backgroundColor: Meteor.settings.public.gemeenteConfig.colorGemeente,
    opacity: '0.8',
    borderRadius: '5px'
};

const innerMenuStyle = {
    padding: '8px 0px'
};

export default LayerMenu = ({map, updateLegenda, menuOpen}) => {
    if (menuOpen) {
        return (
            <div style={menuStyle} >
                <div role='presentation' style={menuPresentationStyle} >
                    <div role='menu' style={innerMenuStyle} >
                        <OverigeLagen map={map} updateLegenda={updateLegenda} />
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}
