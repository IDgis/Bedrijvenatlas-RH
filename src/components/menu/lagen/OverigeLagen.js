import React from 'react';

import BedrijvenLaag from './BedrijvenLaag';
import Kaartlaag from './Kaartlaag';
import ListItem from './ListItem';
import ListItemMenu from './ListItemMenu';

class OverigeLagen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            map: props.map,
            allKvkChecked: false,
            allDetailHandelChecked: false,
            allVastgoedChecked: false,
            listItemMenu: null,
            selectedItem: null
        }
    }

    /**
     * Turns all KVK layers on and off at once
     */
    selectAllKvkLayers = () => {
        const { map, settings, updateLegenda } = this.props;
        let newVisible = !this.state.allKvkChecked;
        let kvk = settings.kvkBedrijven.naam;

        if(map != null) {
            let layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === kvk) {
                    layer.setVisible(newVisible);
                }
            });
        }

        this.setState({
            allKvkChecked: newVisible
        });
        updateLegenda();
    }

    selectAllDetailHandelLayers = (event, l) => {
        const { map, settings, updateLegenda } = this.props;
        let newVisible = !this.state.allDetailHandelChecked;
        let detailHandel = settings.detailHandel.naam;

        if (map != null) {
            let layers = map.getLayers();
            layers.forEach(layer => {
                if (layer.get('title') === detailHandel) {
                    layer.setVisible(newVisible);
                }
            });
        }

        this.setState({
            allDetailHandelChecked: newVisible
        });
        updateLegenda();
    }

    /**
     * Turns all Vastgoed layers on and off at once
     */
    selectAllVastgoedLayers = (event, l) => {
        const { map, settings, updateLegenda } = this.props;
        const newVisible = !this.state.allVastgoedChecked;
        const fundaLayers = settings.fundaLayers;

        if (map) {
            const layers = map.getLayers();
            fundaLayers.forEach(fundaLayer => {
                layers.forEach(layer => {
                    if (layer.get('title') === fundaLayer.titel) {
                        layer.setVisible(newVisible);
                    }
                });
            });
        }

        this.setState({
            allVastgoedChecked: newVisible
        });
        
        updateLegenda();
    }

    /**
     * Checks whether all KVK layers are checked or not and sets its internal state
     */
    setAllKvkChecked = () => {
        const { map, settings } = this.props;
        const kvk = settings.kvkBedrijven.naam;

        if(map != null) {
            let allVisible = true;
            const layers = map.getLayers();
            layers.forEach(layer => {
                if(layer.get('title') === kvk) {
                    allVisible = allVisible && layer.getVisible();
                }
            });

            this.setState({
                allKvkChecked: allVisible
            });
        }
    }

    setAllDetailHandelChecked = () => {
        const { map, settings } = this.props;
        const detailHandel = settings.detailHandel.naam;

        if (map != null) {
            let allVisible = true;
            const layers = map.getLayers();
            layers.forEach(layer => {
                if (layer.get('title') === detailHandel) {
                    allVisible = allVisible && layer.getVisible();
                }
            });

            this.setState({
                allDetailHandelChecked: allVisible
            });
        }
    }

    /**
     * Checks whether all Vastgoed layers are checked or not and sets its internal state
     */
    setAllVastgoedChecked = () => {
        const { map, settings } = this.props;
        const fundaLayers = settings.fundaLayers;

        if (map) {
            let allVisible = true;
            const layers = map.getLayers();
            fundaLayers.forEach(fundaLayer => {
                layers.forEach(layer => {
                    if (layer.get('title') === fundaLayer.titel) {
                        allVisible = allVisible && layer.getVisible();
                    }
                });
            });
            this.setState({
                allVastgoedChecked: allVisible
            });
        }
    }

    /**
     * Get the visibility of all KVK and Detailhandel layers
     */
    getAllLayerGroupChecked = (layerGroupName) => {
        const { map } = this.props;
        let visible = false;

        if (map !== null) {
            let layers = map.getLayers();
            layers.forEach(layer => {
                if (layer.get('title') === layerGroupName) {
                    if (layer.getVisible()) {
                        visible = true;
                    }
                }
            });
            return visible;
        }
        return false;
    }

    /**
     * Get the visibility of all Vastgoed layers
     */
    getAllVastgoedChecked = () => {
        const { settings, map } = this.props;
        const fundaLayers = settings.fundaLayers;
        let anyVisible = false;

        if (map) {
            const layers = map.getLayers();
            fundaLayers.forEach(fundaLayer => {
                layers.forEach(layer => {
                    if (layer.get('title') === fundaLayer.titel && layer.getVisible()) {
                        anyVisible = true;
                    }
                });
            });
            return anyVisible;
        }
        return anyVisible;
    }

    getFundaMenuItems = () => {
        const { map, updateLegenda, settings } = this.props;
        return settings.fundaLayers.map((layer, index) => {
            let newVisible;

            map.getLayers().forEach(l => {
                if (l.get('title') === layer.titel) {
                    newVisible = l.getVisible();
                }
            });
            
            return <Kaartlaag layer={layer} map={map} updateParent={this.setAllVastgoedChecked} updateLegenda={updateLegenda} visible={newVisible} key={layer.titel + index} />
        });
    };

    getCustomLayers = (settings, map, updateLegenda) => (
        settings.overlayLayers.map((layer, index) => (
            <Kaartlaag layer={layer} map={map} updateLegenda={updateLegenda} key={layer.titel + index} />
        ))
    )

    toggleSubmenu = (e, items) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const { settings } = this.props;

        const selectedItem = rect.top;
        const listItemMenu = <ListItemMenu settings={settings} items={items} top={rect.top} left={rect.right} />;

        if (this.state.selectedItem === selectedItem) {
            this.setState({
                selectedItem: null,
                listItemMenu: null
            });
        } else {
            this.setState({
                selectedItem: rect.top,
                listItemMenu
            });
        }
    }

    /**
     * The main render method that will render the component to the screen
     */
    render() {
        const { map, settings, updateLegenda } = this.props;
        const allVastgoedChecked = this.getAllVastgoedChecked();
        const allKvkChecked = this.getAllLayerGroupChecked(settings.kvkBedrijven.naam);
        const allDetailHandelChecked = this.getAllLayerGroupChecked(settings.detailHandel.naam);

        const fundaMenuItems = this.getFundaMenuItems();
        const customLayers = this.getCustomLayers(settings, map, updateLegenda);
        const { listItemMenu } = this.state;

        return (
            <div className='list-menu' style={{padding:'8px 0px'}} >
                <ListItem 
                    primaryText='Te Koop/Huur'
                    isChecked={allVastgoedChecked}
                    selectAll={this.selectAllVastgoedLayers}
                    items={fundaMenuItems}
                    toggleSubmenu={this.toggleSubmenu}
                    />
                <ListItem 
                    primaryText={settings.kvkBedrijven.naam} 
                    isChecked={allKvkChecked}
                    selectAll={this.selectAllKvkLayers}
                    items={Object.keys(settings.kvkBedrijven.namen).length > 0 ? <BedrijvenLaag 
                        layer={settings.kvkBedrijven} 
                        map={map} 
                        updateParent={this.setAllKvkChecked} 
                        updateLegenda={updateLegenda} /> : null}
                    toggleSubmenu={this.toggleSubmenu}
                    />
                <ListItem 
                    primaryText={settings.detailHandel.naam}
                    isChecked={allDetailHandelChecked}
                    selectAll={this.selectAllDetailHandelLayers}
                    items={Object.keys(settings.detailHandel.namen).length > 0 ? <BedrijvenLaag
                        layer={settings.detailHandel}
                        map={map}
                        updateParent={this.setAllDetailHandelChecked}
                        updateLegenda={updateLegenda} /> : null}
                    toggleSubmenu={this.toggleSubmenu}
                    />
                { customLayers }
                { listItemMenu }
            </div>
        );
    }
}

export default OverigeLagen;
