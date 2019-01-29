import React, { Component } from 'react';

const listItemStyle = {
    border: '10px none',
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: 'Roboto, sans-serif',
    cursor: 'pointer',
    textDecoration: 'none',
    margin: '0px',
    padding: '0px',
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
    padding: '0px 72px',
    position: 'relative'
};

export default class Kaartlaag extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: this.getVisible(props)
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({visible: this.getVisible(props)});
    }

    getVisible = (props) => {
        const { map, layer } = props;
        let visible;

        map.getLayers().forEach(l => {
            if (l.get('title') === layer.titel) {
                visible = l.getVisible();
            }
        });

        return visible;
    }

    toggleLayer = () => {
        let map = this.props.map;
        let layers = map.getLayers();
        let allSameNameVisible = true;
        layers.forEach(layer => {
            if(layer.get('title') === this.props.layer.titel) {
                allSameNameVisible = allSameNameVisible && layer.getVisible();
            }
        });
        layers.forEach(layer => {
            if(layer.get('title') === this.props.layer.titel) {
                let newVisible = !allSameNameVisible;
                this.setState({
                    visible: newVisible
                });
                layer.setVisible(newVisible);
            }
            if(this.props.updateParent !== undefined) {
                this.props.updateParent();
            }
        });
        this.props.updateLegenda();
    }

    render() {
        const { layer } = this.props;
        const { visible } = this.state;
        const iconAvailable = layer.icon !== undefined;

        return (
            <div className='list-item' style={listItemStyle}>
                <div style={{cursor:'pointer',position:'absolute',overflow:'visible',display:'block',height:'24px',width:'24px',top:'0px',margin:'5px 12px',left:'4px'}} onClick={this.toggleLayer} >
                    <div style={{display:'flex',width:'100%',height:'100%'}}>
                        <div style={{transition:'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',float:'left',position:'relative',display:'block',flexShrink:'0',width:'24px',marginRight:'16px',marginLeft:'0px',height:'24px',fill:'white'}}>
                            <div>
                                <svg viewBox="0 0 24 24" style={{display:'inline-block',color:'rgba(0, 0, 0, 0.87)',fill:'white',height:'24px',width:'24px',transition:'opacity 1000ms cubic-bezier(0.23, 1, 0.32, 1) 200ms',position:'absolute',opacity:'1'}}><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>
                                <svg viewBox="0 0 24 24" style={{display:'inline-block',color:'rgba(0, 0, 0, 0.87)',fill:'white',height:'24px',width:'24px',transition:'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms',position:'absolute',opacity:visible ? '1' : '0'}}><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {
                        iconAvailable ? <img size="40" color="#757575" src={layer.icon} style={{color:'rgb(117, 117, 117)',backgroundColor:'rgb(188, 188, 188)',display:'block',alignItems:'center',justifyContent:'center',fontSize:'20px',borderRadius:'50%',height:'24px',width:'24px',position:'absolute',top:'0px',margin:'12px',right:'4px'}} /> : null
                    }
                    { layer.titel }
                </div>
            </div>
        );
    }
}
