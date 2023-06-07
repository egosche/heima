import React from 'react';
import Header from "../Suche/components/Header"
import Avatar from './../Benutzer_start/Avatar';
import Axios from 'axios'

/**
 * Startseite der Vermieter
 */
class VStart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: 0,
            Rolle: '',
            UserID: ''
        }
    }

    async componentDidMount(){
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response) {
            console.log(this)
            this.setState({UserID: response.data})
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

    zimmerbestand = (event) => {
        this.props.history.push(
            '/Zimmerbestand'
            ) 
    }

    zimmer = (event) => {
        this.props.history.push(
            '/Zimmer/Einpflegen'
            ) 
    }

    startseite = (event) => {
        this.props.history.push(
            '/'
        )
    } 

    buchungshistorieansehen = (event) => {
        this.props.history.push(
            '/Vermieter/Buchungshistorie'
        )
    } 


    render(){
        if(this.state.auth && (this.state.Rolle === 'Vermieter')) {
            return (
                <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                    <link rel="stylesheet" href="./../Start/Start.css" />
                    <div>
                        <Header />

                    </div>

                    
                    <section className="single-product">
                    <div className="section-center single-product-center">
                    
                        
                        <article className="single-product-info">
                            <div>
                                <p className="single-product-desc">
                                <div>
                                    <Avatar/>
                                    <button id="zimmerbestandbt" className="company-btn" onClick={this.zimmerbestand}>
                                        Zimmerbestand Verwalten
                                    </button>
                                </div>

                                <div>
                                    <button id="buchungshistoriebt" className="company-btn" onClick={this.buchungshistorieansehen}>
                                        Buchungshistorie ansehen
                                    </button>
                                </div>

                                <div>
                                    <button id="zimmereinfuegenbt" className="company-btn" onClick={this.zimmer}>
                                        Zimmer einfügen
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
            return (
                <p>Loading...</p>
            )
        }
      }
    }
      


export default VStart;