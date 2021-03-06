import React, { useEffect, useState } from 'react';

const listItemStyle = {
    border: '10px none',
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: 'Roboto, sans-serif',
    cursor: 'pointer',
    textDecoration: 'none',
    margin: '0px',
    outline: 'currentcolor none medium',
    fontSize: '16px',
    fontWeight: 'inherit',
    position: 'relative',
    zIndex: '1',
    color: 'rgba(0,0,0,0.87)',
    lineHeight: '35px',
    transition: 'all 450ms cubic-bezier(0.23,1,0.32,1) 0ms',
    whiteSpace: 'nowrap',
    background: 'rgba(0,0,0,0) none repeat scroll 0% 0%',
    marginLeft: '0px',
    padding: '0px 72px'
};

const BedrijvenLaag = ({ map, layer, updateParent, updateLegenda }) => {

    const [visibility, setVisibility] = useState({});

    // Initialize the default visibility to false
    useEffect(() => {
        Object.keys(layer.icons).forEach(category => {
            setVisibility(v => ({...v, [category]: false}));
        });
    }, [layer.icons]);

    useEffect(() => {
        map?.getLayers().forEach(l => {
            if (l.get("title") === layer.naam) {
                const source = l.getSource();
                if (source.getState() === "ready" && source.getFeatures().length > 0) {
                    const features = source.getFeatures();
                    const category = features[0].get(layer.filterColumn);
                    setVisibility(v => ({...v, [category]: l.getVisible()}));
                }
            }
        });
    }, [map, layer.filterColumn, layer.naam]);

    /**
     * Show the icons of the selected branche on the map
     */
    const selectBranche = (event, cat) => {
        map?.getLayers().forEach(l => {
            if (l.get("title") === layer.naam) {
                const source = l.getSource();
                if (source.getState() === "ready" && source.getFeatures().length > 0) {
                    const features = source.getFeatures();
                    const category = features[0].get(layer.filterColumn);
                    if (category === cat) {
                        l.setVisible(!l.getVisible());
                        setVisibility({...visibility, [category]: l.getVisible()});
                    }
                }
            }

            if (updateParent !== undefined) {
                updateParent();
            }
        });

        updateLegenda();
    };

    const getOpacity = (category) => {
        let isVisible;
        map?.getLayers().forEach(l => {
            if (l.get("title") === layer.naam) {
                const source = l.getSource();
                if (source.getState() === "ready" && source.getFeatures().length > 0) {
                    const c = source.getFeatures()[0].get(layer.filterColumn);
                    if (c === category) {
                        isVisible = l.getVisible();
                    }
                }
            }
        });

        return isVisible ? "1" : "0";
    };

    const icons = Object.keys(layer.icons).filter((category) => {
        let layerPresent = false;
        map?.getLayers().forEach(l => {
            if (l.get("title") === layer.naam) {
                const source = l.getSource();
                if (source.getState() === "ready" && source.getFeatures().length > 0) {
                    const c = source.getFeatures()[0].get(layer.filterColumn);
                    layerPresent = layerPresent || (c === category);
                }
            }
        });

        return layerPresent;
    });

    return (
        <div>
        {
            icons.map((category, i) => (
                <div className='list-item' style={listItemStyle} key={category + i} >
                    <div style={{cursor:'pointer',position:'absolute',overflow:'visible',display:'block',height:'24px',width:'24px',top:'0px',margin:'5px 12px',left:'4px'}} onClick={(e) => selectBranche(e, category)}>
                        <div style={{display:'flex',width:'100%',height:'100%'}}>
                            <div style={{transition:'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',float:'left',position:'relative',display:'block',flexShrink:'0',width:'24px',marginRight:'16px',marginLeft:'0px',height:'24px',fill:'white'}}>
                                <div>
                                    <svg viewBox="0 0 24 24" style={{display:'inline-block',color:'rgba(0, 0, 0, 0.87)',fill:'white',height:'24px',width:'24px',transition:'opacity 1000ms cubic-bezier(0.23, 1, 0.32, 1) 200ms',position:'absolute',opacity:'1'}}><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>
                                    <svg viewBox="0 0 24 24" style={{display:'inline-block',color:'rgba(0, 0, 0, 0.87)',fill:'white',height:'24px',width:'24px',transition:'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms',position:'absolute',opacity:getOpacity(category)}}><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img size="40" color="#757575" src={layer.icons[category]} alt="" style={{color:'rgb(117, 117, 117)',backgroundColor:'rgb(188, 188, 188)',display:'block',alignItems:'center',justifyContent:'center',fontSize:'20px',borderRadius:'50%',height:'24px',width:'24px',position:'absolute',top:'0px',margin:'12px',right:'4px'}} />
                        { layer.namen[category] }
                    </div>
                </div>
            ))
        }
        </div>
    );
};

export default BedrijvenLaag;
