import React from 'react';

const linkStyle = {
    textDecoration: 'none',
    color: '#000',
    opacity: 1
};

const iconStyle = {
    position: 'relative',
    width: '80%',
    boxShadow: '3px 3px 10px 2px grey'
};

const textStyle = {
    position: 'relative',
    color: '#000'
};

const ViewerLink = ({settings}) => (
    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <a href="/viewer" style={linkStyle}>
            <img style={iconStyle} src={ settings.gemeenteConfig.logoViewerKnop } alt="" />
            <div style={textStyle}>
                <h2>Zoeken op de kaart</h2>
            </div>
        </a>
    </div>
);

export default ViewerLink;
