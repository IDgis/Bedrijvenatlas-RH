import React from 'react';

const linkStyle = {
    textDecoration: 'none',
    color: '#000',
    opacity: 1
}

const iconStyle = {
    position: 'relative',
    width: '80%',
    boxShadow: '3px 3px 10px 2px grey'
}

const textStyle = {
    position: 'relative',
    color: '#000'
}

export default ContactLink = () => (
    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <a href={ Meteor.settings.public.gemeenteConfig.contactPage } target="_blank" style={linkStyle}>
            <img style={iconStyle} src={ Meteor.settings.public.gemeenteConfig.logoContactKnop } />
            <div style={textStyle}>
                <h2>Meer informatie</h2>
            </div>
        </a>
    </div>
);
