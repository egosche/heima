import React from 'react';
import Axios from 'axios';
import SearchBar from "../Start/components/SearchBar";
import Deals from "../Start/components/Deals";
import Header from "../Suche/components/Header"
import Avatar from "./Avatar"


class BStart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            UserID: '', 
            ZimmerIDfk: '',
            Anfang: '',
            Anfangkurz:'',
            Ende: '',
            Endekurz: '',
            Status: '',
            BuchungID: '',
            Modal: false,
            Bewerten: false,
            UserhasProfile: false,
            auth: 0,
            Rolle :''
        }
    }

    async componentDidMount() {
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response) {
            this.setState({UserID: response.data})
            this.setState({auth: 1})

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
                this.setState({ UserhasProfile: true })
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
        else if(this.state.auth && (this.state.Rolle === 'Vermieter')){
            this.props.history.push('/Vermieter')
        }
    }

    buchungshistorieansehen = (event) => {
        this.props.history.push(
            '/Benutzer/Buchungshistorie'
        )
    }

    profilansehen = (event) => {
        this.props.history.push(
            '/Benutzer/Profil?userid=' + this.state.UserID
        )  
    }

    profilerstellen = (event) => {
        this.props.history.push(
            '/Benutzer/Profil/Erstellen?userid=' + this.state.UserID
        )  
    }

    profilbearbeiten = (event) => {
        this.props.history.push(
            '/Benutzer/Profil/Bearbeiten?userid=' + this.state.UserID
        )  
    } 

    render(){
        const { Modal, Bewerten } = this.state

        let profilebuttons;
        if (this.state.UserhasProfile ) {
            profilebuttons = 
            <div>
                <button className="company-btn" id="profilansehenbt" onClick={this.profilansehen}>Profil ansehen</button>
                <button className="company-btn" id="profilbearbeitenbt" onClick={this.profilbearbeiten}>Profil bearbeiten</button>
            </div>;
        } else {
            profilebuttons = 
            <button className="company-btn" id="profilerstellenbt" onClick={this.profilerstellen}>Profil erstellen</button>;
        }

        if(this.state.auth && (this.state.Rolle === 'Benutzer')) {
            return(
                <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                    <div>
                        <Header/>
                    </div>

                    <nav className="navbar page my-20">
                        <div className="nav-center ">
                            <div>
                                <Avatar/>
                                <button className="company-btn " id="buchungshistoriebt" onClick={this.buchungshistorieansehen}>
                                    Buchungshistorie ansehen
                                </button>
                                {profilebuttons}                   
                            </div>
                        </div>
                    </nav>

                    <div>
                        <SearchBar/>

                    </div>


                    <div>
                        <Deals/>

                    </div>
                    
                
                        
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

export default BStart;