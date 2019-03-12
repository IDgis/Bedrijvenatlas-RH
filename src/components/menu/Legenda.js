import React from 'react';

class Legenda extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            legendaItems: []
        }

        this.addLegendaListener();
    }

    componentWillReceiveProps(props) {
        const legendaItems = [];
        const layers = props.map.getLayers();
        const {settings} = props;

        this.getFundaLegenda(layers, legendaItems, settings);
        this.getKvkBedrijvenLegenda(layers, legendaItems, settings);
        this.getDetailhandelLegenda(layers, legendaItems, settings);
        this.getOverlayLayersLegenda(layers, legendaItems, settings);

        this.setState({legendaItems});
    }

    /**
     * Adds a listener for the Legenda component
     */
    addLegendaListener = () => {
        let draggingComponent = null;
        let offsetX;
        let offsetY;

        // Handle mouse events

        document.addEventListener('mousedown', e => {
            const name = e.target.className;
            if (name && typeof name === 'string' && name.indexOf('legenda') !== -1) {
                const legenda = document.getElementById('legenda');
                draggingComponent = e.target;
                const evt = e || window.event;

                offsetX = legenda.offsetLeft + legenda.offsetWidth - evt.clientX;
                offsetY = evt.clientY - legenda.offsetTop;
            }
        });

        document.addEventListener('mouseup', e => {
            draggingComponent = null;
        });

        document.addEventListener('mousemove', e => {
            if (draggingComponent) {
                const evt = e || window.event;
                const legenda = document.getElementById('legenda');

                legenda.style.right = (window.innerWidth - evt.clientX - offsetX) + 'px';
                legenda.style.top = (evt.clientY - offsetY) + 'px';
            }
        });

        // Handle touch events

        document.addEventListener('touchstart', e => {
            const name = e.target.className;
            if (name && name.indexOf('legenda') !== -1) {
                const legenda = document.getElementById('legenda');
                draggingComponent = e.touches[0];
                const evt = e.touches[0];

                offsetX = legenda.offsetLeft + legenda.offsetWidth - evt.clientX;
                offsetY = evt.clientY - legenda.offsetTop;
            }
        });

        document.addEventListener('touchend', e => {
            draggingComponent = null;
        });

        document.addEventListener('touchmove', e => {
            if (draggingComponent) {
                const evt = e.touches[0];
                const legenda = document.getElementById('legenda');
                
                legenda.style.right = (window.innerWidth - evt.clientX - offsetX) + 'px';
                legenda.style.top = (evt.clientY - offsetY) + 'px';
            }
        });
    }

    getFundaLegenda = (layers, legendaItems, settings) => {
        const fundaItems = [];

        layers.forEach((layer, index) => {
            settings.fundaLayers.forEach(layerConfig => {
                if (layer.get('title') === layerConfig.titel && layer.getVisible()) {
                    fundaItems.push(
                        <div key={`legenda_funda_${index}`}>
                            <img className='legenda-icon' src={layerConfig.icon} alt="" /> {layerConfig.titel}
                        </div>
                    );
                }
            });
        });

        if (fundaItems.length > 0) {
            legendaItems.push(
                <div key="legenda_funda">
                    <h3>Te Koop/Huur</h3>
                     <p className='legenda-explantion'>Bedrijfs- en winkelpanden die volgens Funda te koop of te huur staan</p>
                    {fundaItems}
                </div>
            );
        }
    }

    getKvkBedrijvenLegenda = (layers, legendaItems, settings) => {
        const kvkBedrijven = settings.kvkBedrijven;
        const kvkItems = [];

        layers.forEach((layer, index) => {
            if (layer.get('title') === kvkBedrijven.naam && layer.getVisible()) {
                const source = layer.getSource();
                if (source.getState() === 'ready') {
                    const features = source.getFeatures();
                    if (features.length > 0) {
                        const category = features[0].get(kvkBedrijven.filterColumn);
                        const categoryIcon = kvkBedrijven.icons[category];
                        const categoryName = kvkBedrijven.namen[category];

                        kvkItems.push(
                            <div key={`legenda_kvk_${index}`}>
                                <img className='legenda-icon' src={categoryIcon} alt="" /> {categoryName}
                            </div>
                        );
                    }
                }
            }
        });

        if (kvkItems.length > 0) {
            legendaItems.push(
                <div key="legenda_kvk">
                    <h3>{kvkBedrijven.naam}</h3>
                    { kvkBedrijven.omschrijving ? <p className='legenda-explantion'>{kvkBedrijven.omschrijving}</p> : null }
                    {kvkItems}
                </div>
            );
        }
    }

    getDetailhandelLegenda = (layers, legendaItems, settings) => {
        const detailHandel = settings.detailHandel;
        const detailHandelItems = [];

        layers.forEach((layer, i) => {
            if (layer.get('title') === detailHandel.naam && layer.getVisible()) {
                const source = layer.getSource();
                if (source.getState() === 'ready' && source.getFeatures().length > 0) {
                    const features = source.getFeatures();
                    const category = features[0].get(detailHandel.filterColumn);
                    const categoryIcon = detailHandel.icons[category];
                    const categoryName = detailHandel.namen[category];

                    detailHandelItems.push(
                        <div key={`legenda_detail_${i}`}>
                            <img className='legenda-icon' src={categoryIcon} img="" alt="" /> { categoryName }
                        </div>
                    );
                }
            }
        });

        if (detailHandelItems.length > 0) {
            legendaItems.push(
                <div key="legenda_detail">
                    <h3>{ detailHandel.naam }</h3>
                    { detailHandel.omschrijving ? <p className='legenda-explantion'>{ detailHandel.omschrijving }</p> : null }
                    { detailHandelItems }
                </div>
            );
        }
    }

    getOverlayLayersLegenda = (layers, legendaItems, settings) => {
        layers.forEach((layer, index) => {
            settings.overlayLayers.forEach(layerConfig => {
                if (layer.get('title') === layerConfig.titel && layer.getVisible() && layerConfig.service === 'wms') {
                    const url = `${layerConfig.url}&request=GetLegendGraphic&layer=${layerConfig.layers}&format=image/png&width=20&height=20&transparent=false&legend_options=fontColor:0x000;fontName:Roboto`;

                    legendaItems.push(
                        <div key={`legenda_${index}`}>
                            <h3>{layer.get('title')}</h3>
                            { layerConfig.omschrijving ? <p className='legenda-explantion'>{layerConfig.omschrijving}</p> : null }
                            <img src={url} alt="" />
                        </div>
                    );
                }
            });
        });
    }

    render() {
        const {legendaItems} = this.state;
        const {settings} = this.props;

        if (legendaItems.length > 0) {
            return(
                <div id='legenda' className='legenda' style={{backgroundColor:settings.gemeenteConfig.colorGemeente}}>
                    <h2 id='legendaheader' className='legenda-title'>Legenda</h2><hr />
                    <div className='legenda-list'>
                        {legendaItems}
                    </div>
                </div>
            );
        } else {
            return(
                <div style={{display:'none'}} ></div>
            );
        }
    }
}

export default Legenda;
