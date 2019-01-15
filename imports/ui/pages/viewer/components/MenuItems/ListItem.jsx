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

export default class ListItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listItemMenu: null,
            selectedItem: null
        };
    }

    getCheckboxValue = () => {
        const { isChecked } = this.props;

        return isChecked ? 'on' : 'off';
    }

    getOpacity = () => {
        const { isChecked } = this.props;

        return isChecked ? '1' : '0';
    }

    render() {
        const { primaryText, selectAll, toggleSubmenu, items } = this.props;

        return (
            <div className='list-item' style={listItemStyle} >
                <div style={{cursor:'pointer',position:'absolute',overflow:'visible',display:'block',height:'24px',width:'24px',top:'0px',margin:'5px 12px',left:'4px'}} onClick={selectAll} >
                    <input type="checkbox" color="#757575" style={{position:'absolute',cursor:'inherit',pointerEvents:'all',opacity:'0',width:'100%',height:'100%',zIndex:'2',left:'0px',boxSizing:'border-box',padding:'0px',margin:'0px'}} value={this.getCheckboxValue()} />
                    <div style={{display:'flex',width:'100%',height:'100%'}}>
                        <div style={{transition:'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',float:'left',position:'relative',display:'block',flexShrink:'0',width:'24px',marginRight:'16px',marginLeft:'0px',height:'24px',fill:'white'}}>
                            <div>
                                <svg viewBox="0 0 24 24" style={{display:'inline-block',color:'rgba(0, 0, 0, 0.87)',fill:'white',height:'24px',width:'24px',transition:'opacity 1000ms cubic-bezier(0.23, 1, 0.32, 1) 200ms',position:'absolute',opacity:'1'}}><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>
                                <svg viewBox="0 0 24 24" style={{display:'inline-block',color:'rgba(0, 0, 0, 0.87)',fill:'white',height:'24px',width:'24px',transition:'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms',position:'absolute',opacity:this.getOpacity()}}><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={(e) => {toggleSubmenu(e, items)}} >
                    <svg viewBox="0 0 24 24" style={{display:'block',color:'rgba(0, 0, 0, 0.87)',fill:'white',height:'24px',width:'24px',transition:'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',position:'absolute',top:'0px',margin:'5px 12px',right:'4px'}}><path d="M9.5,7l5,5l-5,5V7z"></path></svg>
                    <div style={{display:'inline-block'}}>{ primaryText }</div>
                </div>
            </div>
        );
    }
}
