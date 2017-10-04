import React, { Component } from 'react';


export default class ViewerLink extends Component {

    render() {
        return (
            <a href="/viewer" className='a-link'>
                <div className='viewer-link'>
                    <div>
                        <img className='image-link' src={Meteor.settings.public.logoViewerUrl} />
                    </div>
                    <div className='text-link'>
                        <h2>Zoeken op de kaart</h2>
                    </div>
                </div>
            </a>
        );
    }
}