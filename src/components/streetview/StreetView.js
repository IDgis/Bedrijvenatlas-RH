import React from 'react';

import ReactStreetView from 'react-streetview';

import CustomButton from '../menu/CustomButton';

const StreetView = ({coords, close}) => {
    const lng = coords[0];
    const lat = coords[1];

    const streetViewPanoramaOptions = {
        position: {lng: lng, lat: lat},
        pov: {heading: 100, pitch: 0},
        zoom: 1
    };

    return(
        <div style={{width: '400px', height: '400px', position: 'absolute', top: (window.innerHeight-56-400), right: 0, zIndex:2}}>
            <ReactStreetView 
                apiKey='AIzaSyDSK_RTj2gR5YKl_TxgQidR9NkuHCpHi0I'
                streetViewPanoramaOptions={streetViewPanoramaOptions}
            />
            <CustomButton style={{position:'absolute', bottom: 0, left:0, zIndex: 3}} onClick={close}>
                Sluiten
            </CustomButton>
        </div>
    );
}

export default StreetView;
