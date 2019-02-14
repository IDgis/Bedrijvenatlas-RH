import React from 'react';

const WizardLink = ({settings}) => {
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

    return (
        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <a href="/wizard" style={linkStyle}>
            <img style={iconStyle} src={ settings.gemeenteConfig.logoWizardKnop } alt="" />
                <div style={textStyle}>
                    <h2>Ik wil een bedrijf (her)vestigen</h2>
                </div>
            </a>
        </div>
    );
}

export default WizardLink;
