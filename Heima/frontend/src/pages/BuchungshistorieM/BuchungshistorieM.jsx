import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"
import Mail from "../../Mail"


/**
 *  BuchungshistorieM.jsx ermöglicht das Einsehen der getätigten Buchungen für den Benutzer.
 */

var mounted = 0
var stop = true
var aenderungStatus = {
    BuchungID: '',
    Status: ''
}
var zimmertitel = []

// Create our number formatter.
var formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

class BuchungshistorieM extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            BenutzerID: '',
            BuchungID: '',
            ZimmerIDfk: '',
            ZimmerID:'',
            VermieterID:'',
            Status: '',
            PreisproNacht: '',
            Anfang: '',
            Ende: '',
            Buchungszeitpunkt: '',
            ZusatzleistungID: '',
            Zusatzleistungen: '',
            data: [{"BuchungID": '', "ZimmerIDfk": '', "Status": '', "PreisproNacht": '', "Anfang": '',
            "Ende": '', "Buchungszeitpunkt": '', "ZusatzleistungID": '', "Zusatzleistungen": '', "ZimmerID":'', "VermieterID":'',}],
            bwdata: [{
                BewertungID: '',
                AnzahlSterne : '',
                BewertungsZeitpunkt: '',
                ZimmerIDfk: '',
                ErstellerIDfk: '',
                BesitzerIDfk: '',
                BuchungIDfk: ''
            }],
            auth: 0,
            Rolle : ''
        }
    }
    
    async componentDidMount() {
        mounted = 1
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response)  {
            this.setState({auth: 1})
            this.setState({BenutzerID: response.data})
            await Axios.get("http://localhost:3001/user/byID/" + this.state.BenutzerID).then((response) => {
                this.setState({Rolle: response.data[0].Rolle})
            }).catch(function(error){
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
            this.checkLesen();
            this.tick()
            this.ticker = setInterval(() => this.tick(), 5000);
            Axios.get('http://localhost:3001/bewertung/').then((response) => {
            mounted && this.setState({bwdata: response.data});
            })
        }
    }

    componentWillUnmount() {
        mounted = 0
    }

    async checkLesen(){       
        await Axios.get("http://localhost:3001/buchung/byBenutzerID/" + this.state.BenutzerID).then((response) => {
        this.setState({data: response.data});
        })              

        for(let i=0; i<this.state.data.length; i++)
        {
            aenderungStatus.BuchungID = this.state.data[i].BuchungID;
            this.terminieren(this.state.data[i].Buchungszeitpunkt, this.state.data[i].Status, this.state.data[i].ErstellerIDfk);
        }
    }

    async tick (){
        //Id des Benutzers immer 2 bei Testdaten
        if (!mounted) {return}
             
        await Axios.get("http://localhost:3001/buchung/byBenutzerID/" + this.state.BenutzerID).then((response) => {
            this.setState({data: response.data});     
        }) 

        let t = this.state.data.slice();
        for (let i=0; i<this.state.data.length; i++) {
            await Axios.get("http://localhost:3001/zimmer/" + this.state.data[i].ZimmerIDfk).then((response) => {
                console.log(response.data[0])
                t[i].ZimmerID = t[i].ZimmerIDfk          //ZimmerID speichern
                t[i].VermieterID = t[i].VermieterIDfk
                zimmertitel[i] = response.data[0].Titel //ZimmerIDfk ist TITEL nicht ZimmerIDfk
            }).catch(function(error) {
                console.log("Fatal Error!")
            })
        }
        await this.setState({data: t});
    }
    
    /**
     * @param {string} Buchungszeitpunkt Zeitpunkt an dem die Buchung getätigt wurde
     * @param {string} Status Buchungsstatus (akzeptiert, ausstehend, abgelehnt, vom Nutzer storniert)
     * @param {int} BenutzerID 
     * 
     * Prüft prüft ob nach 7 Tagen der Vermieter noch nicht den Status der Buchung geändert hat,
     * sollte er noch nicht, wird der Status von ausstehend auf abgelehnt geändert
     */
      
    terminieren(Buchungszeitpunkt, Status, BenutzerID){
        let heute = new Date();                    
        let stichtag = new Date(Buchungszeitpunkt);
        stichtag.setDate(stichtag.getDate() + 7);                      
        if(stichtag <= heute && Status === 'ausstehend')
        {
            aenderungStatus.Status = "abgelehnt";
            Axios.patch("http://localhost:3001/buchung/status", aenderungStatus); 
            Mail.buchungAblehnung(BenutzerID);
        }
        return false;    
    }

    datum(Datum){
        let format = new Date(Datum);
        let dd = String(format.getDate()).padStart(2, '0');
        let mm = String(format.getMonth() + 1).padStart(2, '0'); 
        let yyyy = format.getFullYear();

        format = dd + '.' + mm + '.' + yyyy;
        return(format)
    }
 
    zurueck = (event)=> (
        this.props.history.push('/Benutzer') 
    )

    bewerten = (event) => {
        this.props.history.push(
            '/Bewertung/?id=' + this.state.data[event.target.id].BuchungID
            ) 
    }

    stornieren = (event) => {
        aenderungStatus.BuchungID = this.state.data[event.target.id].BuchungID
        aenderungStatus.Status = 'vom Nutzer storniert'
        Axios.patch("http://localhost:3001/buchung/status", aenderungStatus)
        Mail.stornierung(this.state.data[event.target.id].VermieterID,this.state.BenutzerID)
    }

    /**
     * @param {string} Anfang Anfangsdatum der Buchung/Reise
     * @param {string} Ende Enddatum der Buchung/Reise
     * @param {string} Status Buchungsstatus (akzeptiert, ausstehend, abgelehnt, vom Nutzer storniert)
     * @param {int} iD 
     * @returns Anzuzeigende Button oder keine Button
     * 
     * Prüft welche Button gebraucht werden
     */

    button(Anfang, Ende, Status, iD){
        let Grundb = 'b'
        let Grunds = 's'
        return(
        <td className="px-4 py-2 border">
            {(this.checkDate(Anfang, Status, Grunds)) && (<button id = {iD} className="btn ml-10 mt-1" onClick={this.stornieren}>Stornieren</button>)}
            {(this.checkDate(Ende, Status, Grundb)) && ( <button id = {iD} className="btn ml-10 mt-1" onClick={this.bewerten}>Bewerten</button>)} 
        </td>
        )
    }
  
    /**
     * Überprüfung ob eine Bewertung für das Zimmer schon abgegeben wurde, setzen eines Booleans
     * Verhindert eine erneute Bewertungsabgabe
     */

    renderData() {
        this.state.bwdata.map((bewertung, index) => {
           const {AnzahlSterne, ZimmerIDfk, ErstellerIDfk, BesitzerIDfk, BuchungIDfk} = bewertung
           if((BuchungIDfk === this.state.BuchungID) && (BesitzerIDfk === this.state.VermieterID)){
               stop = false
            } else{
               console.log("Alternative");
           }
        })
     } 


    renderTableData() {
        return this.state.data.map((buchung, index) => {
           const { BuchungID, ZimmerIDfk, Status, PreisproNacht, Anfang, Ende, Buchungszeitpunkt, ZusatzleistungID, Zusatzleistungen } = buchung

           return (
              <tr key={BuchungID}>
                 <td className="px-4 py-2 border">{BuchungID}</td>
                 <td className="px-4 py-2 border">{zimmertitel[index]}</td> 
                 <td className="px-4 py-2 border">{Status}</td>
                 <td className="px-4 py-2 border">{formatter.format(PreisproNacht)}</td>
                 <td className="px-4 py-2 border">{this.datum(Anfang)}</td>
                 <td className="px-4 py-2 border">{this.datum(Ende)}</td>
                 <td className="px-4 py-2 border">{this.datum(Buchungszeitpunkt)}</td>
                 <td className="px-4 py-2 border">{ZusatzleistungID}</td>
                 <td className="px-4 py-2 border">{Zusatzleistungen}</td>
                 {this.button(Anfang, Ende, Status, index)}
              </tr>
           )
        })
     }  


     /**
      * Ermöglicht die Option bewerten und stornieren unter bestimmten Voraussetzungen
      * Option bewerten - Reise wurde angetreten, das Enddatum ist erreicht und es existiert noch keine Bewertung
      * Option stornieren - Reise wurde nicht angetreten, die Buchung wurde vom Vermieter akzeptiert oder ist noch ausstehend
      * 
      * @param {string} Ende Enddatum der Buchung/Reise
      * @param {string} Status Buchungsstatus (akzeptiert, ausstehend, abgelehnt, vom Nutzer storniert)
      * @param {string} Grund Grundb - bezieht sich auf den Bewerten-Button, Grunds - auf den Stornieren-Button
      * @returns boolean true - Anzeige Button, false - kein Anzeigen der Button
      * 
      */

     checkDate(Ende, Status, Grund){
        var heute = new Date();
        var dd = String(heute.getDate()).padStart(2, '0');
        var mm = String(heute.getMonth() + 1).padStart(2, '0'); 
        var yyyy = heute.getFullYear();
        heute = (yyyy + '-' + mm + '-' + dd);

        var Endekurz = Ende.substring(0, Ende.indexOf('T'));

        var ende = new Date(Endekurz);
        var d = String(ende.getDate()+1).padStart(2, '0');
        
        var m = String(ende.getMonth() + 1).padStart(2, '0'); 
        var y = ende.getFullYear();
        ende = (y + '-' + m + '-' + d);

        if(Grund ==='b'){
            this.renderData();
            if( ((ende <= heute) && (Status === 'akzeptiert') && (stop === true))){ 
                return true
        
            }
            stop = true
        }
        else if(Grund === 's'){
            
            if((ende > heute && Status !== 'abgelehnt' && Status !=='vom Nutzer storniert')){
                return true
            }
        }      
        return false;
    }

    render(){
        if(this.state.auth && (this.state.Rolle === 'Benutzer')) {
            return(
                <div>
                    <div>
                        <Header/>
                    </div>
                    <div>
                        <table id= 'table' className="table-fixed shadow-2xl bg-white border-2 border-black m-10" >
                            <th className="px-4 py-2 border"><b>BuchungID</b></th>
                            <th className="px-4 py-2 border"><b>Titel</b></th>
                            <th className="px-4 py-2 border"><b>Status</b></th>
                            <th className="px-4 py-2 border"><b>Preis</b></th>
                            <th className="px-4 py-2 border"><b>Anfang</b></th>
                            <th className="px-4 py-2 border"><b>Ende</b></th>
                            <th className="px-4 py-2 border"><b>Buchungszeitpunkt</b></th>
                            <th className="px-4 py-2 border"><b>ZusatzleistungID</b></th>
                            <th className="px-4 py-2 border"><b>Zusatzleistungen</b></th>
                            <th className="px-4 py-2 border"> </th>
                            <tbody>
                                {this.renderTableData()}
                                
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button className="btn ml-10" onClick={this.zurueck}>
                            Zurück
                        </button>
                    </div>
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

export default BuchungshistorieM;
