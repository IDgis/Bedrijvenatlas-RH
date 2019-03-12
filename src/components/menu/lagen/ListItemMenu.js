import React from 'react';

const ListItemMenu = ({left, top, items, settings}) => {
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
        whiteSpace: 'nowrap',
        maxHeight: '966px',
        height: 'auto',
        top: top-211,
        left: left+70
    };

    const menuPresentationStyle = {
        zIndex: '1000',
        backgroundColor: settings.gemeenteConfig.colorGemeente,
        opacity: '1',
        borderRadius: '5px'
    };
    
    const innerMenuStyle = {
        padding: '8px 0px'
    };

    return (
        <div style={menuStyle} >
            <div role='presentation' style={menuPresentationStyle} >                    
                <div role='menu' style={innerMenuStyle}>
                    { items }
                </div>
            </div>
        </div>
    );
}

export default ListItemMenu;
