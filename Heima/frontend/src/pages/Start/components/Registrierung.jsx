import React from 'react';
import Axios from 'axios';
import Mail from "../../../Mail"

const bcrypt = require("bcryptjs")

/**
 * Die Registrierung ermöglicht es einem Gast sich als Benutzer oder Vermieter zu registrieren
 */

class Registrierung extends React.Component {

    state = {
        EMailAdresse: '',
        pw: '',
        Passwort: '',
        Vorname: '',
        Nachname: '',
        Sprache: '', 
        Telefonnummer: '', 
        Ort: '', 
        Land: '', 
        Hausnummer: '', 
        Strasse: '', 
        RegistrierDatum: '', 
        Geschlecht: '', 
        Rolle: ''

    }

    handleEmailChange = (event) => {
        this.setState({EMailAdresse: event.target.value});
    }
    
    handlePW1Change = (event) => {
        this.setState({pw: event.target.value});
    }

    handlePW2Change = (event) => {
        this.setState({Passwort: event.target.value});
    }

    handleVornameChange = (event) => {
        this.setState({Vorname: event.target.value});
    }

    handleNachnameChange = (event) => {
        this.setState({Nachname: event.target.value});
    }

    handleSpracheChange = (event) => {
        this.setState({Sprache: event.target.value});
    }

    handleTelefonnummerChange = (event) => {
        this.setState({Telefonnummer: event.target.value});
    }

    handleOrtChange = (event) => {
        this.setState({Ort: event.target.value});
    }

    handleLandChange = (event) => {
        this.setState({Land: event.target.value});
    }

    handleHausnummerChange = (event) => {
        this.setState({Hausnummer: event.target.value});
    }

    handleStrasseChange = (event) => {
        this.setState({Strasse: event.target.value}, () => {
            this.handleRegistrierDatumChange();
        });
    }


    handleRegistrierDatumChange = (event) => {
        let heute = new Date();
        let dd = String(heute.getDate()).padStart(2, '0');
        let mm = String(heute.getMonth() + 1).padStart(2, '0');
        let yyyy = heute.getFullYear();

        heute = yyyy + '-' + mm + '-' + dd;
        this.setState({RegistrierDatum: heute});
    }

    handleGeschlechtChange = (event) => {
        this.setState({Geschlecht: event.target.value});
    }

    handleRolleChange = (event) => {
        this.setState({Rolle: event.target.value});
    }

    zurueck = (event)=> (
        this.props.history.push(
            '/'
        ) 
    )
    
    registrieren = async(event)=> {
        
        if(((this.state.EMailAdresse&&this.state.Passwort&&this.state.Vorname&&this.state.Nachname&&this.state.Sprache&&this.state.Telefonnummer&&
            this.state.Ort&&this.state.Land&&this.state.Hausnummer&&this.state.Strasse&&this.state.RegistrierDatum&&this.state.Geschlecht&&this.state.Rolle)!== '') &&
            ( this.state.pw ===  this.state.Passwort)){

            //wird benötigt, damit Axios-Post wartet, bis in hashing() das gehashte Passwort gesetzt wird
            const result = await this.hashing()
            
            Axios.post("http://localhost:3001/user",this.state);
                
            Mail.registrierung(this.state.EMailAdresse);
            alert("Du bist registriert")

            this.props.history.push('/Anmelden')
        }
        else if( this.state.pw !==  this.state.Passwort){
            alert("Passwort stimmt nicht überein")
        }
        else {
            alert("Registrierung fehlgeschlagen! Bitte überprüfen Sie Ihre Eingabe.");
        }
    }

    /**
     * Funktion nimmt das Passwort im Klartext & hasht es zsm mit dem zuvor generierten Salt und speichert dieses wieder im 
     * State Passwort
     */
    async hashing() {

        const salzRunden=10
        const originalPW = this.state.Passwort

        const salz = await bcrypt.genSalt(salzRunden)
        const hashPW = await bcrypt.hash(originalPW, salz)

        this.setState({Passwort: hashPW})
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

                            <h1 className="text-center text-3xl text-blue-600">Registrierung</h1>

                            <form className="pt-6 pb-2 my-2">
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="rollefeld1">
                                        Rolle
                                    </label>
                                    <div className="mt-2">
                                        <label className="inline-flex items-center">
                                            <input type="radio" className="form-radio" name="rolle" value="Vermieter" id='rollefeld1' onChange={this.handleRolleChange}/>
                                            <span className="ml-2">Vermieter </span>
                                        </label>
                                        <label className="inline-flex items-center ml-6">
                                            <input type="radio" className="form-radio" name="rolle" value="Benutzer" id='rollefeld2' onChange={this.handleRolleChange}/>
                                            <span className="ml-2">Benutzer</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="emailfeld">
                                        Email-Adresse
                                    </label>
                                    <input value={this.state.EMailAdresse} id='emailfeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                    placeholder="Email-Adresse" onChange={this.handleEmailChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="passwortfeld1">
                                        Passwort
                                    </label>
                                    <input value={this.state.pw} id='passwortfeld1' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" 
                                    type="password" placeholder="Passwort" onChange={this.handlePW1Change}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="passwortfeld2">
                                        Passwort wiederholen
                                    </label>
                                    <input value={this.state.Passwort} id='passwortfeld2' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" 
                                    type="password" placeholder="Passwort wiederholen" onChange={this.handlePW2Change}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="vornamefeld">
                                        Vorname
                                    </label>
                                    <input value={this.state.Vorname} id='vornamefeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" 
                                    placeholder="Vorname" onChange={this.handleVornameChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="nachnamefeld">
                                        Nachname
                                    </label>
                                    <input value={this.state.Nachname} id='nachnamefeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    placeholder="Nachname" onChange={this.handleNachnameChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="geschlechtfeld1">
                                        Geschlecht
                                    </label>
                                    <div className="mt-2">
                                        <label className="inline-flex items-center">
                                            <input type="radio" className="form-radio" name="geschlecht" value="m" id='geschlechtfeld1' onChange={this.handleGeschlechtChange}/>
                                            <span className="ml-2">männlich </span>
                                        </label>
                                        <label className="inline-flex items-center ml-6">
                                            <input type="radio" className="form-radio" name="geschlecht" value="w" id='geschlechtfeld2' onChange={this.handleGeschlechtChange}/>
                                            <span className="ml-2">weiblich</span>
                                        </label>
                                        <label className="inline-flex items-center ml-6">
                                            <input type="radio" className="form-radio" name="geschlecht" value="d" id='geschlechtfeld3' onChange={this.handleGeschlechtChange}/>
                                            <span className="ml-2">divers</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="sprachefeld">
                                        Sprache
                                    </label>
                                    <input value={this.state.Sprache} id='sprachefeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    placeholder="Sprache" onChange={this.handleSpracheChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="telefonfeld">
                                        Telefonnummer
                                    </label>
                                    <input value={this.state.Telefonnummer} id='telefonfeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    placeholder="Telefonnummer" onChange={this.handleTelefonnummerChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="landfeld">
                                        Land
                                    </label>
                                    <input value={this.state.Land} id='landfeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    placeholder="Land" onChange={this.handleLandChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="ortfeld">
                                        Ort
                                    </label>
                                    <input value={this.state.Ort} id='ortfeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    placeholder="Ort" onChange={this.handleOrtChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="hausnrfeld">
                                        Hausnummer
                                    </label>
                                    <input value={this.state.Hausnummer} id='hausnrfeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    placeholder="Hausnummer" onChange={this.handleHausnummerChange}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="strassefeld">
                                        Straße
                                    </label>
                                    <input value={this.state.Strasse} id='strassefeld' className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                                    placeholder="Straße" onChange={this.handleStrasseChange}/>
                                </div>
                                <div className="block md:flex items-center justify-between">
                                    <div>
                                        <button id="registrierenbt" className="bg-green hover:bg-blue-200 text-blue-600 font-bold py-2 px-4 rounded border-b-4 border-r-4 border-blue-800" type="button" onClick={this.registrieren}>
                                            registrieren
                                            
                                        </button>
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
export default Registrierung;
