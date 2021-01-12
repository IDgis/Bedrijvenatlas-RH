import React, { useEffect, useState } from 'react';

const Legenda = ({ settings, map }) => {

    const [legendaItems, setLegendaItems] = useState([]);
    const [visibleLayers, setVisibleLayers] = useState([]);

    /**
     * Adds a listener for the Legenda component
     */
    useEffect(() => {
        let draggingComponent = null;
        let offsetX;
        let offsetY;

        // Mouse events
        const mouseDownEvent = (e) => {
            const name = e.target.className;
            if (name && typeof name === "string" && name.indexOf("legenda") !== -1) {
                const legenda = document.getElementById("legenda");
                draggingComponent = e.target;
                const evt = e || window.event;

                offsetX = legenda.offsetLeft + legenda.offsetWidth - evt.clientX;
                offsetY = evt.clientY - legenda.offsetTop;
            }
        };

        const mouseUpEvent = (e) => {
            draggingComponent = null;
        };

        const mouseMoveEvent = (e) => {
            if (draggingComponent) {
                const evt = e || window.event;
                const legenda = document.getElementById("legenda");

                legenda.style.right = (window.innerWidth - evt.clientX - offsetX) + "px";
                legenda.style.top = (evt.clientY - offsetY) + "px";
            }
        };

        // Touch events

        const touchStartEvent = (e) => {
            const name = e.target.className;
            if (name && name.indexOf("legenda") !== -1) {
                const legenda = document.getElementById("legenda");
                draggingComponent = e.touches[0];
                const evt = e.touches[0];

                offsetX = legenda.offsetLeft + legenda.offsetWidth - evt.clientX;
                offsetY = evt.clientY - legenda.offsetTop;
            }
        };

        const touchEndEvent = (e) => {
            draggingComponent = null;
        };

        const touchMoveEvent = (e) => {
            const evt = e.touches[0];
            const legenda = document.getElementById("legenda");

            legenda.style.right = (window.innerWidth - evt.clientX - offsetX) + "px";
            legenda.style.top = (evt.clientY - offsetY) + "px";
        };

        document.addEventListener("mousedown", mouseDownEvent);
        document.addEventListener("mouseup", mouseUpEvent);
        document.addEventListener("mousemove", mouseMoveEvent);
        document.addEventListener("touchstart", touchStartEvent);
        document.addEventListener("touchend", touchEndEvent);
        document.addEventListener("touchmove", touchMoveEvent);

        return () => {
            // Clean up events
            document.removeEventListener("mousedown", mouseDownEvent);
            document.removeEventListener("mouseup", mouseUpEvent);
            document.removeEventListener("mousemove", mouseMoveEvent);
            document.removeEventListener("touchstart", touchStartEvent);
            document.removeEventListener("touchend", touchEndEvent);
            document.removeEventListener("touchmove", touchMoveEvent);
        };
    }, []);

    useEffect(() => {
        map?.getLayers().forEach(layer => {
            const { kvkBedrijven, detailHandel } = settings;
            const title = layer.get("title");
            const isVisible = visibleLayers.filter(l => l === title).length > 0;
    
            if (title === kvkBedrijven.naam) {
                const source = layer.getSource();
                if (source.getState() === "ready") {
                    const features = source.getFeatures();
                    if (features.length > 0) {
                        const category = features[0].get(kvkBedrijven.filterColumn);
                        const categoryName = kvkBedrijven.namen[category];
                        const isKvkVisible = visibleLayers.filter(l => l === categoryName).length > 0;

                        if (layer.getVisible()) {
                            if (!isKvkVisible) {
                                setVisibleLayers(oldVisibleLayers => [...oldVisibleLayers, categoryName]);
                            }
                        } else if (isKvkVisible) {
                            setVisibleLayers(oldVisibleLayers => [...oldVisibleLayers.filter(l => l !== categoryName)]);
                        }
                    }
                }
            } else if (title === detailHandel.naam) {
                const source = layer.getSource();
                if (source.getState() === "ready") {
                    const features = source.getFeatures();
                    if (features.length > 0) {
                        const category = features[0].get(detailHandel.filterColumn);
                        const categoryName = detailHandel.namen[category];
                        const isDetailHandelVisible = visibleLayers.filter(l => l === categoryName).length > 0;

                        if (layer.getVisible()) {
                            if (!isDetailHandelVisible) {
                                setVisibleLayers(oldVisibleLayers => [...oldVisibleLayers, categoryName]);
                            }
                        } else if (isDetailHandelVisible) {
                            setVisibleLayers(oldVisibleLayers => [...oldVisibleLayers.filter(l => l !== categoryName)]);
                        }
                    }
                }
            } else if (layer.getVisible()) {
                if (!isVisible) {
                    setVisibleLayers(oldVisibleLayers => [...oldVisibleLayers, title]);
                }
            } else if (isVisible) {
                setVisibleLayers(oldVisibleLayers => [...oldVisibleLayers.filter(l => l !== title)]);
            }
        });
    });

    useEffect(() => {
        const getFundaLegenda = () => {
            const fundaLegendaItems = [];
            const fundaItems = [];

            map?.getLayers().forEach(layer => {
                settings.fundaLayers.forEach(layerConfig => {
                    if (layer.get("title") === layerConfig.titel && layer.getVisible()) {
                        fundaItems.push(
                            <div key={`legenda_funda_${layerConfig.titel}`}>
                                <img className="legenda-icon" src={ layerConfig.icon } alt="" /> { layerConfig.titel }
                            </div>
                        );
                    }
                });
            });

            if (fundaItems.length > 0) {
                fundaLegendaItems.push(
                    <div key="legenda_funda">
                        <h3>Te Koop/Huur</h3>
                        <p className="legenda-explanation">Bedrijfs- en winkelpanden die volgens Funda te koop of the huur staan</p>
                        { fundaItems }
                    </div>
                );
            }
            return fundaLegendaItems;
        };

        const getKvkBedrijvenLegenda = () => {
            const kvkBedrijven = settings.kvkBedrijven;
            const kvkItems = [];
            const kvkLegendaItems = [];

            map?.getLayers().forEach(layer => {
                if (layer.get("title") === kvkBedrijven.naam && layer.getVisible()) {
                    const source = layer.getSource();
                    if (source.getState() === "ready") {
                        const features = source.getFeatures();
                        if (features.length > 0) {
                            const category = features[0].get(kvkBedrijven.filterColumn);
                            const categoryIcon = kvkBedrijven.icons[category];
                            const categoryName = kvkBedrijven.namen[category];

                            kvkItems.push(
                                <div key={`legenda_kvk_${categoryName}`}>
                                    <img className="legenda-icon" src={ categoryIcon } alt="" /> { categoryName }
                                </div>
                            );
                        }
                    }
                }
            });

            if (kvkItems.length > 0) {
                kvkLegendaItems.push(
                    <div key="legenda_kvk">
                        <h3>{ kvkBedrijven.naam }</h3>
                        { kvkBedrijven.omschrijving ? <p className='legenda-explanation'>{kvkBedrijven.omschrijving}</p> : null }
                        { kvkItems }
                    </div>
                );
            }

            return kvkLegendaItems;
        };

        const getDetailhandelLegenda = () => {
            const detailHandel = settings.detailHandel;
            const detailHandelItems = [];
            const detailHandelLegendaItems = [];

            map?.getLayers().forEach(layer => {
                if (layer.get("title") === detailHandel.naam && layer.getVisible()) {
                    const source = layer.getSource();
                    if (source.getState() === "ready" && source.getFeatures().length > 0) {
                        const category = source.getFeatures()[0].get(detailHandel.filterColumn);
                        const categoryIcon = detailHandel.icons[category];
                        const categoryName = detailHandel.namen[category];

                        detailHandelItems.push(
                            <div key={`legenda_detail_${categoryName}`}>
                                <img className="legenda-icon" src={ categoryIcon } alt="" /> { categoryName }
                            </div>
                        );
                    }
                }
            });

            if (detailHandelItems.length > 0) {
                detailHandelLegendaItems.push(
                    <div key="legenda_detail">
                        <h3>{ detailHandel.naam }</h3>
                        { detailHandel.omschrijving ? <p className='legenda-explanation'>{ detailHandel.omschrijving }</p> : null }
                        { detailHandelItems }
                    </div>
                );
            }

            return detailHandelLegendaItems;
        };

        const getOverlayLayersLegenda = () => {
            const overlayLayersLegendaItems = [];

            map?.getLayers().forEach(layer => {
                settings.overlayLayers.forEach(layerConfig => {
                    if (layer.get("title") === layerConfig.titel && layer.getVisible() && layerConfig.service === "wms") {
                        const url = `${layerConfig.url}&request=GetLegendGraphic&layer=${layerConfig.layers}&format=image/png&width=20&height=20&transparent=false&legend_options=fontColor:0x000;fontName:Roboto`;

                        overlayLayersLegendaItems.push(
                            <div key={`legenda_overlay_${layerConfig.titel}`}>
                                <h3>{ layer.get("title") }</h3>
                                { layerConfig.omschrijving ? <p className='legenda-explantion'>{layerConfig.omschrijving}</p> : null }
                                <img src={url} alt="" />
                            </div>
                        );
                    }
                });
            });

            return overlayLayersLegendaItems;
        };

        const fundaItems = getFundaLegenda();
        const kvkItems = getKvkBedrijvenLegenda();
        const detailHandelItems = getDetailhandelLegenda();
        const overlayLayersItems = getOverlayLayersLegenda();
        
        setLegendaItems([...fundaItems, ...kvkItems, ...detailHandelItems, ...overlayLayersItems]);
    }, [map, settings, visibleLayers]);

    if (legendaItems.length > 0) {
        return (
            <div id='legenda' className='legenda' style={{backgroundColor:settings.gemeenteConfig.colorGemeente}}>
                <h2 id='legendaheader' className='legenda-title'>Legenda</h2><hr />
                <div className='legenda-list'>
                    { legendaItems }
                </div>
            </div>
        );
    } else {
        return (
            <div style={{display:'none'}}></div>
        );
    }
};

export default Legenda;
