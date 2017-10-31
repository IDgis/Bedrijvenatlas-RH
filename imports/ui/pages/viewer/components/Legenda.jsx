import React, { Component } from 'react';


export default class Legenda extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: this.props.map,
            teKoopHuurVisible: false,
            teKoopHuurLegenda: <div></div>,
            bedrijvenVisible: false,
            bedrijvenLegenda: <div></div>,
            kavelsVisible: false,
            kavelsLegenda: <div></div>,
            milieuVisible: false,
            milieuLegenda: <div></div>,
            bedrijventerreinenVisible: false,
            bedrijventerreinenLegenda: <div></div>
        }
        this.addListener();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            map: nextProps.map
        });
        this.setTeKoopHuurLegenda(nextProps.map);
        this.setKavelsLegenda(nextProps.map);
        this.setBedrijvenLegenda(nextProps.map);
        this.setMilieuLegenda(nextProps.map);
        this.setBedrijventerreinenLegenda(nextProps.map);
    }

    /**
     * Add a listener for dragging the legenda component
     */
    addListener() {
        let draggingTarget = null;
        let offsetX;
        let offsetY;

        document.addEventListener('mousemove', function(e) {
            if(draggingTarget) {
                let evt = e || window.event;
                let d = document.getElementById('legenda');
                d.style.right = (window.innerWidth - evt.clientX - offsetX)+'px';
                d.style.top = (evt.clientY - offsetY)+'px';
            }
        });

        document.addEventListener('mousedown', function(e) {
            let name = e.target.className;
            if(name && name.indexOf('draggable') !== -1) {
                let doc = document.getElementById('legenda');
                draggingTarget = e.target;
                let evt = e || window.event;

                offsetX = doc.offsetLeft + doc.offsetWidth - evt.clientX;
                offsetY = evt.clientY - doc.offsetTop;
            }
        });

        document.addEventListener('mouseup', function(e) {
            draggingTarget = null;
        });

        document.addEventListener('touchstart', function(e) {
            let name = e.target.className;
            if(name && name.indexOf('draggable') !== -1) {
                let doc = document.getElementById('legenda');
                draggingTarget = e.touches[0];
                let evt = e.touches[0];

                offsetX = doc.offsetLeft + doc.offsetWidth - evt.clientX;
                offsetY = evt.clientY - doc.offsetTop;
            }
        });

        document.addEventListener('touchend', function(e) {
            draggingTarget = null;
        });

        document.addEventListener('touchmove', function(e) {
            if(draggingTarget) {
                let evt = e.touches[0];
                let d = document.getElementById('legenda');
                d.style.right = (window.innerWidth - evt.clientX - offsetX)+'px';
                d.style.top = (evt.clientY - offsetY)+'px';
            }
        });
    }

    /**
     * Create the legenda with icons for Te Koop/Huur
     */
    setTeKoopHuurLegenda(map) {
        let teKoop = Meteor.settings.public.laagNaam.teKoop;
        let teHuur = Meteor.settings.public.laagNaam.teHuur;

        let teKoopDiv = <div style={{display:'none'}}></div>;
        let teHuurDiv = <div style={{display:'none'}}></div>;
        let visible = false;

        if(map !== null) {
            map.getLayers().forEach((layer, index) => {
                if(layer.get('title') === teKoop && layer.getVisible()) {
                    visible = true;
                    teKoopDiv = <div className='legenda-item draggable'>
                        <img className='legenda-icon draggable' src={Meteor.settings.public.iconKoop} /> {Meteor.settings.public.laagNaam.teKoop} 
                    </div>;
                } else if(layer.get('title') === teHuur && layer.getVisible()) {
                    visible = true;
                    teHuurDiv = <div className='legenda-item draggable'>
                        <img className='legenda-icon draggable' src={Meteor.settings.public.iconHuur} /> {Meteor.settings.public.laagNaam.teHuur} 
                    </div>;
                }
            });
        }

        this.setState({
            teKoopHuurVisible: visible
        });

        if(visible) {
            let legenda = <div className='vastgoed-legenda draggable'>
                <h3 className='draggable'>{Meteor.settings.public.laagNaam.vastgoed}</h3>
                {teKoopDiv}
                {teHuurDiv}
            </div>;
            this.setState({
                teKoopHuurLegenda: legenda
            });
        } else {
            this.setState({
                teKoopHuurLegenda: <div style={{display:'none'}}></div>,
            });
        }
    }

    /**
     * Creates the legenda for available Kavels
     */
    setKavelsLegenda(map) {
        let kavels = Meteor.settings.public.laagNaam.kavels;
        let kavelsDiv = <div style={{display:'none'}}></div>;
        let visible = false;

        if(map !== null) {
            map.getLayers().forEach((layer, index) => {
                if(layer.get('title') === kavels && layer.getVisible()) {
                    visible = true;
                    kavelsDiv = <div className='legenda-item draggable'>
                        <img className='legenda-icon draggable' src={Meteor.settings.public.iconKavels} /> {kavels} <br />
                    </div>;
                }
            });
        }

        this.setState({
            kavelsVisible: visible
        });

        if(visible) {
            let legenda = <div className='kavels-legenda draggable'>
                <h3 className='draggable'>{kavels}</h3>
                {kavelsDiv}
            </div>;
            this.setState({
                kavelsLegenda: legenda
            });
        } else {
            this.setState({
                kavelsLegenda: <div style={{display:'none'}}></div>,
            });
        }
    }

    /**
     * Create the legenda for bedrijven
     */
    setBedrijvenLegenda(map) {
        let bedrijven = Meteor.settings.public.laagNaam.kvk;
        let bedrijvenDiv = <div></div>;
        let visible = false;
        let bArr = [];

        if(map !== null) {
            map.getLayers().forEach((layer, index) => {
                if(layer.get('title') === bedrijven && layer.getVisible()) {
                    visible = true;
                    let source = layer.getSource();
                    if(source.getState() === 'ready') {
                        let features = source.getFeatures();
                        let cat = features[0].get('SBI_RUBR_C');
                        let categorieUrl = Meteor.settings.public.categorieUrl[cat];
                        let categorieNaam = Meteor.settings.public.categorieNaam[cat];
                        bArr.push(<div key={index}>
                            <img className='legenda-icon draggable' src={categorieUrl} /> {categorieNaam} 
                        </div>);
                    }
                }
            });
        }

        this.setState({
            bedrijvenVisible: visible
        });

        if(visible) {
            let legenda = <div className='bedrijven-legenda draggable'>
                <h3 className='draggable'>{Meteor.settings.public.laagNaam.kvk}</h3>
                <div className='bedrijven-legenda-item draggable'>
                    {bArr}
                </div>
            </div>;
            this.setState({
                bedrijvenLegenda: legenda
            });
        } else {
            this.setState({
                bedrijvenLegenda: <div style={{display:'none'}}></div>
            });
        }
    }

    /**
     * Create the legenda for milieucategorien
     */
    setMilieuLegenda(map) {
        let milieu = Meteor.settings.public.laagNaam.milieu;
        let milieuDiv = <div style={{display:'none'}}></div>;
        let visible = false;

        if(map !== null) {
            map.getLayers().forEach((layer, index) => {
                if(layer.get('title') === milieu && layer.getVisible()) {
                    visible = true;
                    milieuDiv = <div className='legenda-item draggable'>
                        <img className='legenda-icon draggable' src={Meteor.settings.public.milieuUrl.C2} /> Bedrijf tot en met categorie 2 <br />
                        <img className='legenda-icon draggable' src={Meteor.settings.public.milieuUrl.C31} /> Bedrijf tot en met categorie 3.1 <br />
                        <img className='legenda-icon draggable' src={Meteor.settings.public.milieuUrl.C32} /> Bedrijf tot en met categorie 3.2 <br />
                        <img className='legenda-icon draggable' src={Meteor.settings.public.milieuUrl.C41} /> Bedrijf tot en met categorie 4.1 <br />
                        <img className='legenda-icon draggable' src={Meteor.settings.public.milieuUrl.C42} /> Bedrijf tot en met categorie 4.2 <br />
                    </div>;
                }
            });
        }

        this.setState({
            milieuVisible: visible
        });

        if(visible) {
            let legenda = <div className='milieu-legenda draggable'>
                <h3 className='draggable'>{Meteor.settings.public.laagNaam.milieu}</h3>
                {milieuDiv}
            </div>;
            this.setState({
                milieuLegenda: legenda
            });
        } else {
            this.setState({
                milieuLegenda: <div style={{display:'none'}}></div>,
            });
        }
    }

    /**
     * Creates the legenda for Bedrijventerreinen
     */
    setBedrijventerreinenLegenda(map) {
        let terreinen = Meteor.settings.public.laagNaam.ibis;
        let terreinenDiv = <div style={{display:'none'}}></div>;
        let visible = false;

        if(map !== null) {
            map.getLayers().forEach((layer, index) => {
                if(layer.get('title') === terreinen && layer.getVisible()) {
                    visible = true;
                    terreinenDiv = <div className='legenda-item draggable'>
                        <img className='legenda-icon draggable' src={Meteor.settings.public.iconBedrijventerreinen} /> {terreinen} <br />
                    </div>;
                }
            });
        }

        this.setState({
            bedrijventerreinenVisible: visible
        });

        if(visible) {
            let legenda = <div className='terreinen-legenda draggable'>
                <h3 className='draggable'>{terreinen}</h3>
                {terreinenDiv}
            </div>;
            this.setState({
                bedrijventerreinenLegenda: legenda
            });
        } else {
            this.setState({
                bedrijventerreinenLegenda: <div style={{display:'none'}}></div>,
            });
        }
    }

    /**
     * Render the legenda to the screen
     */
    render() {
        let anyVisible = this.state.teKoopHuurVisible || this.state.milieuVisible || this.state.bedrijvenVisible || this.state.kavelsVisible || this.state.bedrijventerreinenVisible;
        
        if(anyVisible) {
            return (
                <div id='legenda' className='legenda draggable' draggable={true}>
                    <h2 className='legenda-title draggable' draggable={true}>Legenda</h2><hr />
                    <div className='legenda-list draggable' draggable={true}>
                        {this.state.teKoopHuurLegenda}
                        {this.state.kavelsLegenda}
                        {this.state.bedrijvenLegenda}
                        {this.state.milieuLegenda}
                        {this.state.bedrijventerreinenLegenda}
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