import React from 'react';

const MenuBar = ({settings}) => (
    <div className='menu-bar' style={{backgroundColor:settings.gemeenteConfig.colorGemeente}} >
        <div className='logo-rh' >
            <a href={settings.gemeenteConfig.homePage} target='_blank' rel='noopener noreferrer' >
                <img style={{height:'56px'}} src={settings.gemeenteConfig.logo} alt={settings.gemeenteConfig.altText} />
            </a>
        </div>
        Bedrijvenatlas
        <div className='logo-idgis' >
            <a href={settings.idgisConfig.homePage} target='_blank' rel='noopener noreferrer' >
                <img style={{height:'56px'}} src={settings.idgisConfig.logo} alt={settings.idgisConfig.altText} />
            </a>
        </div>
    </div>
);

export default MenuBar;
