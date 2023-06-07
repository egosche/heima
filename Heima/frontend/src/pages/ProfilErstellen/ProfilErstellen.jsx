import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"

class ProfilErstellen extends React.Component{
    state = {
        Profilbild: '',
        Freitextbeschreibung: '',
        BesitzerIDfk: '',
        auth: 0,
        Rolle: ''
    }

    async componentDidMount() {
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response) {
            this.setState({auth: 1})
            this.setState({BesitzerIDfk: response.data})
            await Axios.get("http://localhost:3001/user/byID/" + this.state.BesitzerIDfk).then((res) => {
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
                this.props.history.push('/Vermieter')
            }
    }

    handleFreitextbeschreibungChange = (event) => {
        this.setState({Freitextbeschreibung: event.target.value});
    }

    handleBildChange = (event) => {
        const reader = new FileReader();
        reader.onload = async ()  => {
             if(reader.readyState === 2){
                this.setState({Profilbild: reader.result})
            }
        }
        reader.readAsDataURL(event.target.files[0])
    }

    zurueck = (event)=> (
        this.props.history.push(
            '/Benutzer'
            ) 
    )

    erstellen = (event)=> {
        if((this.state.Freitextbeschreibung && this.state.Profilbild && this.state.BesitzerIDfk)!== '') 
        {
            Axios.post("http://localhost:3001/profil", this.state);
            this.props.history.push(
                '/Benutzer'
                ) 
        }
        else {
            console.log('Fehlerhafte Eingabe')
        }
    }

    render(){
        if(this.state.auth && (this.state.Rolle === 'Benutzer')){
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
                                    
                                        <input className="search-input" id="freitextbeschreibungtf" type="text" size = "200" 
                                            placeholder = "Freitextbeschreibung" defaultValue={this.state.Freitextbeschreibung} 
                                            onChange ={this.handleFreitextbeschreibungChange} />
                                        
                                    </div>
                                
                                    <div>
                                        <input className="search-input" id="bildupload" accept="image/jpeg" type="file" size = "15" 
                                        onChange={this.handleBildChange} />
                                    </div>
                                    <div>
                                        <button className="addToCartBtn btn mt-10" id="zurueckbt" data-id="id" onClick={this.zurueck}>
                                            Zurück
                                        </button>
                                        <button className="addToCartBtn btn ml-4 mt-10" id="erstellenbt" data-id="id" onClick={this.erstellen}>
                                            Erstellen
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
            );
        }
    }
}
export default ProfilErstellen;