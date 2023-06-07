import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"
import Bewertung from "../Start/components/BewertungStatisch"

class Profil extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            UserID: '',
            ProfilID: '',
            Profilbild: '',
            Freitextbeschreibung: '',
            BesitzerIDfk: '',
            Vorname: '',
            Nachname: '',
            auth: 0,
            Rolle: ''
        }
    }
    
    /**
     *  Wird die Seite geladen, wird aus der URL die angemeldete UserID genommen und anhand dieser
     *  die Attribute zum jeweiligen Profil geladen. Um Vor- und Nachnamen zu erhalten wird zusaetzlich
     *  eine weitere Route benutzt.
     */
    async componentDidMount() {
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response)  {
            this.setState({auth: 1})
            this.setState({UserID: response.data})
            await Axios.get("http://localhost:3001/user/byID/" + this.state.UserID).then((res) => {
                this.setState({Rolle: res.data[0].Rolle})
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
            await Axios.get("http://localhost:3001/profil/byBesitzerId/" + this.state.UserID).then((response) => {
                this.setState({ProfilID: response.data[0].ProfilID});
                this.setState({Profilbild: response.data[0].Profilbild});
                this.setState({Freitextbeschreibung: response.data[0].Freitextbeschreibung});
                this.setState({BesitzerIDfk: response.data[0].BesitzerIDfk});

                Axios.get("http://localhost:3001/user/byID/" + this.state.BesitzerIDfk).then((response) => {
                    this.setState({Vorname: response.data[0].Vorname});
                    this.setState({Nachname: response.data[0].Nachname});
                })

            }).catch(function(error){
                if(error.response && error.response.status !== 200)
                {
                    console.log("Retrieve profil error " + error.response.status)
                }
                else {
                    console.log(error.message)
                }
            })
        }
        else {
            this.props.history.push('/Vermieter')
        }
    }  

    //Zurückknopf
    zurueck = (event)=> (
        this.props.history.push('/Benutzer') 
    )


    render(){
        if (this.state.auth && (this.state.ProfilID !== '') &&(this.state.Rolle === 'Benutzer')) {
            return(
                <div>
                    <div>
                        <Header/>
                    </div>
                    <section className="single-product">
                        <div className="section-center single-product-center">
                
                    
                            <article className="single-product-info">
                                <div>
                                    <p className="single-product-desc">
                    
                                    <div>
                                        <p>{this.state.Vorname} {this.state.Nachname}</p>
                                        <img id="profilimg"
                                        src={this.state.Profilbild}
                                        className="single-product-img img"
                                        alt="Profilbild"
                                        />
                                        <Bewertung/>
                                        <p>Beschreibung: {this.state.Freitextbeschreibung}</p>
                                    </div>
                                    <div>
                                        <button id="profilzurueckbt" className="btn" onClick={this.zurueck}>
                                            Zurück
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
        else if (this.state.auth &&(this.state.Rolle === 'Benutzer')){
            return(
                <div>
                    <div>
                        <Header/>
                    </div>
                    <div>
                        <p>Es wurde zur angefragten UserID kein passendes Profil gefunden!</p>
                    </div>
                </div>
            );
        }
        else {
            return <p>Loading...</p>
        }
    }
}

export default Profil;