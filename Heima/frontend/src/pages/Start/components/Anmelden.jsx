import React from 'react';
import Axios from 'axios';

const bcrypt = require("bcryptjs")

/**
 * Die Anmeldung ermöglicht es einem Gast sich als Benutzer oder Vermieter anzumelden
 */

class Anmelden extends React.Component {

    state = {
        EMailAdresse: '',
        Passwort: '',
        UserID: '',
        hashedPasswort: ''
    }

    handleEmailChange = (event) => {
        this.setState({EMailAdresse: event.target.value});
    }

    handlePWChange = (event) => {
        this.setState({Passwort: event.target.value});
    }

    zurueck = (event)=> (
        this.props.history.push(
            '/'
        ) 
    )
    
    anmelden = (event)=> {
       
        if(((this.state.EMailAdresse&&this.state.Passwort)!== '')){

            Axios.post('http://localhost:3001/user/byEmail', {
                EMailAdresse: this.state.EMailAdresse
            }).then(async (response) => { 

                this.setState({UserID: response.data[0].UserID});
                this.setState({hashedPasswort: response.data[0].Passwort});

                const result = await this.hashing() //check password

                if((this.state.UserID !== '') && (result)) {
                    await Axios.get('http://localhost:3001/auth/tokens/' + this.state.UserID, 
                    {withCredentials: true}
                    ).catch(function(error) {
                        if(error.response && error.response.status !== 200)
                        {
                            console.log("Retrieve auth error " + error.response.status)
                        }
                        else {
                            console.log(error.message)
                        }
                    });
                    this.props.history.push('/Benutzer') 
                }
                else{
                    console.log("UserID leer, kein HistoryPush für dich :)")
                }
                
            }).catch(function(error) {
                if(error.response && error.response.status !== 200)
                {
                    console.log("Retrieve auth error " + error.response.status)
                }
                else {
                    console.log(error.message)
                }
            });
        }
        else if((this.state.EMailAdresse && this.state.Passwort) === ''){
            alert("Bitte gib in beiden Feldern deine Anmeldedaten ein!")
        }
        else{
            alert("Etwas im Backend läuft schief")
        }
    }

    /**
     * vergleicht das gehashte Passwort aus der Datenbank mit dem vom Benuter eingebenen
     */
    async hashing() {

        const passwortEingabe = this.state.Passwort
        const passwortHash = this.state.hashedPasswort

        const isMatch = await bcrypt.compare(passwortEingabe, passwortHash)

       if(isMatch){
            return true
        } else{
            return false
        }
    }


    render(){
       
        return( 
            <div>
                <div className="flex items-center">
                    <div className="fixed pin bg-black opacity-75 z-10"></div>

                    <div className="relative mx-6 md:mx-auto w-full md:w-1/2 lg:w-1/3 z-20 m-8">
                        <div className="shadow-lg bg-white rounded-lg p-8">
                            <div className="flex justify-end mb-6">
                                <button id="closebt" onClick={this.zurueck}>
                                    <span className="mr-2">Schließen</span>
                                    <span>
                                        <i className="fa fa-times"></i>
                                    </span>
                                </button>
                            </div>

                            <h1 className="text-center text-3xl text-blue-600">Anmelden</h1>

                            <form className="pt-6 pb-2 my-2">
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="email">
                                        Email-Adresse
                                    </label>
                                    <input value={this.state.email} id='emailfeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="email" 
                                    placeholder="Email-Adresse" onChange={this.handleEmailChange} autoComplete="on"/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="passwort">
                                        Passwort
                                    </label>
                                    <input value={this.state.passwort} id='passwortfeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    type="password" placeholder="Passwort" onChange={this.handlePWChange} autoComplete="on"/>
                                </div>
                                <div className="block md:flex items-center justify-between">
                                    <div>
                                        <button id="anmeldenbt" className="bg-green hover:bg-blue-200 text-blue-600 font-bold py-2 px-4 rounded border-b-4 border-r-4 border-blue-800" type="button" onClick={this.anmelden}>
                                            anmelden
                                            
                                        </button>
                                    </div>

                                    <div className="mt-4 md:mt-0">
                                        <a id="registrierenbt" href="./Registrierung" className="text-green no-underline">Noch kein Konto?</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        
        );
    }

}
export default Anmelden;
