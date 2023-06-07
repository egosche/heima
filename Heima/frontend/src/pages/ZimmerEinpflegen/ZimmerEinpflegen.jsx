import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"



class ZimmerEinpflegen extends React.Component{
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
        UserID: '',
        auth : '',
        Rolle : ''
    }

    async componentDidMount(){
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response) {
            console.log(this)
            this.setState({UserID: response.data})
            this.setState({VermieterIDfk: response.data})
            this.setState({auth: 1})
            
            await Axios.get("http://localhost:3001/user/byID/" + this.state.UserID).then((res) => {
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

        if(this.state.auth && (this.state.Rolle === 'Benutzer')){
            this.props.history.push('/Benutzer')
        }
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
    
    handleBildChange = (event) => {
        //console.log(event.target.files[0])
        const reader = new FileReader();
        reader.onload = async ()  => {
             if(reader.readyState === 2){
                this.setState({Bild: reader.result})
                console.log(this.state.Bild)
            }
        }
        reader.readAsDataURL(event.target.files[0])
    }

    zurueck = (event)=> (
        this.props.history.push(
            '/Vermieter'
            ) 
    )

    speichern = (event)=> {
        if((this.state.Titel && this.state.Beschreibung && this.state.Verfuegbarkeit && this.state.PreisproNacht && this.state.Zimmerkategorie && 
            this.state.Ort && this.state.Strasse && this.state.Hausnummer && this.state.Land && this.state.Anzahl && 
            this.state.Ausstattungsangebot && this.state.Bild)!== ''){
            
            Axios.post("http://localhost:3001/zimmer",this.state);
        }
        else {
            console.log('Feherlhafte eingabe')
        }
    }
    
    render(){
        if (this.state.auth &&(this.state.Rolle === 'Vermieter')){
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
                                        <input className="search-input" id="titeltf" type="text" size ="15" placeholder="Titel" 
                                        onChange ={this.handleTitelChange} />
            
                                        <input className="search-input ml-4" id="orttf" type="text" size="15" placeholder="Ort" 
                                        onChange={this.handleOrtChange} />
                                    </div>
                                    <div>
                                        <input className="search-input" id="strassetf" type="text" size="15" placeholder="Straße" 
                                        onChange={this.handleStrasseChange} />
                                    
                                        <input className="search-input ml-4" id="hausnummertf" type="text" size="15" placeholder="Hausnummer" 
                                        onChange={this.handleHausNrChange} />
                                    </div>
                                    <div>
                                        <input className="search-input" id="landtf" type="text" size="15" placeholder="Land" 
                                        onChange={this.handleLandChange} />
                                    
                                        <input className="search-input ml-4" id="anzahlzimmertf" type="text" size ="15" placeholder="Anzahl Zimmer" 
                                        onChange={this.handleAnzahlChange} />
                                    </div>
                                    <div>
                                        <input className="search-input" id="ausstattungtf" type="text" size ="15" placeholder="Ausstattung" 
                                        onChange={this.handleAusstatungChange} />
                                    
                                        <input className="search-input ml-4" id="beschreibungtf" type="text" size ="15" placeholder="Beschreibung" 
                                        onChange={this.handleBeschreibungChange} />
                                    </div>
                                    <div>
                                        <input className="search-input" id="zusatzleistungentf" type="text" size="15" placeholder="Zusatzleistungen" 
                                        onChange={this.handleZusatzleitungenChange} />
                                    
                                        <input className="search-input ml-4" id="zimmerkategorietf" type="text" size="15" placeholder="Zimmerkategorie" 
                                        onChange={this.handleZimmerkategorieChange} />
                                    </div>
                                    <div className="w-screen">
                                        <input className="search-input" id="preispronachttf" type="text" size="15" placeholder="Preis pro Nacht" 
                                        onChange={this.handlePreisChange} />
                                        
                                        <select className="search-input ml-4" id="verfuegbarkeitselect" name="stadt" value={this.state.verfügbarkeit} 
                                        onChange={this.handleVerfuegbarkeitChange}>
                                            <option value="" defaultValue>Verfügbarkeit auswählen...</option>
                                            <option value='frei'>Frei</option>
                                            <option value='belegt'>Belegt</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input className="search-input" id="bildupload" type="file" accept="image/jpeg" size="15" 
                                        onChange={this.handleBildChange} />
                                    </div>
                                    <div>
                                        <button className="addToCartBtn btn mt-10" id="zurueckbt" data-id="id" onClick={this.zurueck}>
                                            Zurück
                                        </button>
                                        <button className="addToCartBtn btn ml-4 mt-10" id="speichernbt" data-id="id" onClick={this.speichern}>
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

        else {
            return(
                <p>Loading...</p>
            )
        }
    }
}

 
export default ZimmerEinpflegen;