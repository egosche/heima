import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"

class ZimmerBearbeiten extends React.Component{
    state = {
        ZimmerID: '',
        Titel: '',
        Beschreibung: '',
        Verfuegbarkeit: '',
        PreisproNacht: '',
        Zimmerkategorie: '',
        Bild: null,
        Ort: '',
        Land: '',
        Strasse: '',
        Hausnummer: '',
        Zusatzleistungen: '',
        Ausstattungsangebot: '',
        VermieterIDfk: '',
        Anzahl: '',
        auth: 0,
        Rolle: ''
    }

    async componentDidMount() {
        
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response) {
            console.log(this)
            this.setState({VermieterIDfk: response.data})
            this.setState({auth: 1})
            
            await Axios.get("http://localhost:3001/user/byID/" + this.state.VermieterIDfk).then((res) => {
                this.setState({Rolle: res.data[0].Rolle})
                console.log("Hier bin ICH:"+ res.data[0].Rolle)
            }).catch(function(error){
                if(error.res && error.res.status !== 200)
                {
                    console.log("Auth failed with error code " + error.res.status)
                    this.props.history.push("/Anmelden")
                }
                else {
                    console.log(error.message)
                    this.props.history.push("/Anmelden")
                }
            }.bind(this))
        }.bind(this)).catch(function(error){
            if(error.response && error.response.status !== 200)
            {
                console.log("Auth failed with error code " + error.response.status)
                this.props.history.push("/Anmelden")
            }
            else {
                console.log(error.message)
                this.props.history.push("/Anmelden")
            }
        }.bind(this)) 
        if(this.state.auth && (this.state.Rolle === 'Vermieter')){
            const params = new URLSearchParams(this.props.location.search)
            await this.setState({ ZimmerID: params.get('id') });

            await Axios.get("http://localhost:3001/zimmer/"+this.state.ZimmerID).then((response) => {
            
                this.setState({ZimmerID: response.data[0].ZimmerID});
                this.setState({Titel: response.data[0].Titel});
                this.setState({Beschreibung: response.data[0].Beschreibung});
                this.setState({Verfuegbarkeit: response.data[0].Verfuegbarkeit});
                this.setState({PreisproNacht: response.data[0].PreisproNacht});
                this.setState({Zimmerkategorie: response.data[0].Zimmerkategorie});
                this.setState({Bild: response.data[0].Bild});
                this.setState({Ort: response.data[0].Ort});
                this.setState({Land: response.data[0].Land});
                this.setState({Hausnummer: response.data[0].Hausnummer});
                this.setState({Zusatzleistungen: response.data[0].Zusatzleistungen});
                this.setState({Ausstattungsangebot: response.data[0].Ausstattungsangebot});
                this.setState({VermieterIDfk: response.data[0].VermieterIDfk});
                this.setState({Anzahl: response.data[0].Anzahl});
                this.setState({Strasse: response.data[0].Strasse});
            })
        }
    }

    async speichernF(){
        await Axios.put("http://localhost:3001/zimmer",this.state);
        await this.props.history.push(
            '/Zimmerbestand'
            ) 
    }

    handleTitelChange = (event) => {
        this.setState({Titel: event.target.value});
    }

    handleOrtChange = (event) => {
        this.setState({Ort: event.target.value});
    }

    handleStrasseChange = (event) => {
        this.setState({Strasse: event.target.value});
    }

    handleHausNrChange = (event) => {
        this.setState({Hausnummer: event.target.value});
    }

    handleLandChange = (event) => {
        this.setState({Land: event.target.value});
    }

    handleZusatzleitungenChange = (event) => {
        this.setState({Zusatzleistungen: event.target.value});
    }

    handleAnzahlChange = (event) => {
        this.setState({Anzahl: event.target.value});
    }

    handlePreisChange = (event) => {
        this.setState({PreisproNacht: event.target.value});
    }

    handleAusstatungChange = (event) => {
        this.setState({Ausstattungsangebot: event.target.value});
    }

    handleBeschreibungChange = (event) => {
        this.setState({Beschreibung: event.target.value});
    }

    handleZimmerkategorieChange = (event) => {
        this.setState({Zimmerkategorie: event.target.value});
    }

    handleVerfuegbarkeitChange = (event) => {
        this.setState({Verfuegbarkeit: event.target.value});
    }

    zurueck = (event)=> (
        this.props.history.push(
            '/Zimmerbestand'
            ) 
    )

    speichern = (event)=> {
        if((this.state.Titel&&this.state.Beschreibung&&this.state.Verfuegbarkeit&&this.state.PreisproNacht&&this.state.Zimmerkategorie&&this.state.Ort&&this.state.Strasse&&this.state.Hausnummer&&this.state.Land&&this.state.Anzahl&&this.Ausstattungsangebot )!== ''){
            this.speichernF()
            
        }
        else {
            console.log('Feherlhafte eingabe')
        }
    }

    render(){
        if(this.state.auth){
            return (
                <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" /> 
                <div>
                    <Header/>
                </div>

                <section className="single-product">
                <div className="section-center single-product-center">
                        
                    <article className="single-product-info">
                        <div>
                                
                            <div className="single-product-colors"></div>
                                <p className="single-product-desc">
                                    
                                    <div>
                                    
                                        <input className="search-input" type="text" size = "15" placeholder = "Titel" defaultValue={this.state.Titel}  onChange ={this.handleTitelChange}/>
            
                                        <input className="search-input ml-4" type="text" size = "15" placeholder = "Ort" defaultValue={this.state.Ort} onChange ={this.handleOrtChange}/>
                                        
                                    </div>
                                    <div>
                                        <input className="search-input"  type="text" size = "15" placeholder = "Straße" defaultValue={this.state.Strasse} onChange ={this.handleStrasseChange}/>
                                    
                                        <input className="search-input ml-4" type="text" size = "15" placeholder = "Hausnummer" defaultValue={this.state.Hausnummer} onChange ={this.handleHausNrChange}/>
                                    </div>
                                    <div>
                                        <input className="search-input" type="text" size = "15" placeholder = "Land" defaultValue={this.state.Land} onChange ={this.handleLandChange}/>
                                    
                                        <input className="search-input ml-4" type="text" size = "15" placeholder = "Anzahl Zimmer" defaultValue={this.state.Anzahl} onChange ={this.handleAnzahlChange}/>
                                    </div>
                                    <div>
                                        <input className="search-input" type="text" size = "15" placeholder = "Ausstattung" defaultValue={this.state.Ausstattungsangebot} onChange ={this.handleAusstatungChange}/>
                                    
                                        <input className="search-input ml-4" type="text" size = "15" placeholder = "Beschreibung" defaultValue={this.state.Beschreibung} onChange ={this.handleBeschreibungChange}/>
                                    </div>
                                    <div>
                                        <input className="search-input" type="text" size = "15" placeholder = "Zusatzleistungen" defaultValue={this.state.Zusatzleistungen} onChange ={this.handleZusatzleitungenChange}/>
                                    
                                        <input className="search-input ml-4" type="text" size = "15" placeholder = "Zimmerkategorie" defaultValue={this.state.Zimmerkategorie} onChange ={this.handleZimmerkategorieChange}/>
                                    </div>
                                    <div className="w-screen">
                                        <input className="search-input" type="text" size = "15" placeholder = "Preis pro Nacht" defaultValue={this.state.PreisproNacht} onChange ={this.handlePreisChange}/>
                                        
                                        <select className="search-input ml-4" name="stadt" defaultValue={this.state.Verfuegbarkeit} onChange={this.handleVerfuegbarkeitChange}>
                                            <option value="">Verfügbarkeit auswählen...</option>
                                            <option value='frei'>Frei</option>
                                            <option value='belegt'>Belegt</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input className="search-input" type="file" size = "15" onChange={this.handleBildChange}/>
                                    </div>
                                    <div>
                                        <button className="addToCartBtn btn mt-10" data-id="id" onClick={this.zurueck}>
                                            Zurück
                                        </button>
                                        <button className="addToCartBtn btn ml-4 mt-10" data-id="id" onClick={this.speichern}>
                                            Speichern
                                        </button>
                                    </div>
                                </p>
                                    
                            </div>
                        </article>
                    </div>
                    </section>
                    
                </div>
            );
        }
        else{
            return(
                <p>Loading...</p>
            )
        }
    }
}
export default ZimmerBearbeiten;