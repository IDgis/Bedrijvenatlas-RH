import React from 'react';
import { mount } from 'react-mounter';

import MapLayout from '../../ui/layouts/MapLayout.jsx';
import MenuLayout from '../../ui/layouts/MenuLayout.jsx';
import WelcomePage from '../../ui/pages/welcome/WelcomePage.jsx';
import WizardPage from '../../ui/pages/wizard/WizardPage.jsx';

FlowRouter.route('/', {
    action() {
        mount(MenuLayout, {
            content: (<WelcomePage />)
        })
    }
});

FlowRouter.route('/wizard', {
    action() {
        mount(MenuLayout, {
            content: (<WizardPage />)
        })
    }
});

FlowRouter.route('/viewer', {
    action() {
        mount(MapLayout)
    }
});