import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"
import Mail from "../../Mail"


/**
 *  BuchungshistorieV.jsx ermöglicht für den Vermieter das Einsehen der angefragten Zimmer.
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
  
  
  

class BuchungshistorieV extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            BuchungID: '',
            ErstellerIDfk: '2',
            ZimmerIDfk: '',
            ZimmerID:'',
            Status: '',
            PreisproNacht: '',
            Anfang: '',
            Ende: '',
            Buchungszeitpunkt: '',
            ZusatzleistungID: '',
            Zusatzleistungen: '',
            data: [{"BuchungID": '', "ErstellerIDfk": '', "ZimmerIDfk": '', "Status": '', "PreisproNacht": '', "Anfang": '',
            "Ende": '', "Buchungszeitpunkt": '', "ZusatzleistungID": '', "Zusatzleistungen": '', "ZimmerID":'', }],
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
            UserID: '',
            Rolle: ''
        }
    }
    
    async componentDidMount() {
        mounted = 1
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

        if(this.state.auth && (this.state.Rolle === 'Vermieter')){
            this.checkLesen();
            this.tick()
            this.ticker = setInterval(() => this.tick(), 5000);

            Axios.get('http://localhost:3001/bewertung/').then((response) => {
                this.setState({bwdata: response.data});
            })

            await Axios.get("http://localhost:3001/buchung/byVermieterID/" + this.state.UserID).then((response) => {
                this.setState({data: response.data});
                        
            })
            let t = this.state.data.slice();
            for (let i=0; i<this.state.data.length; i++){
                await Axios.get("http://localhost:3001/zimmer/" + this.state.data[i].ZimmerIDfk).then((response) => {
                    t[i].ZimmerID = t[i].ZimmerIDfk;            //ZimmerID speichern
                    t[i].ZimmerIDfk = response.data[0].Titel; //ZimmerIDfk ist TITEL nicht ZimmerIDfk
                })
            }
            await this.setState({data: t});
        }
        else {
            this.props.history.push("/Benutzer")
        }
    }

    componentWillUnmount() {
        mounted = 0
    }

    async checkLesen(){
        await Axios.get("http://localhost:3001/buchung/byVermieterID/" + this.state.UserID).then((response) => {
            this.setState({data: response.data});
        })              
        for(let i=0; i<this.state.data.length; i++)
        {
            aenderungStatus.BuchungID = this.state.data[i].BuchungID;
            this.terminieren(this.state.data[i].Buchungszeitpunkt, this.state.data[i].Status, this.state.data[i].ErstellerIDfk);
        }
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

    async tick (){
        if (!mounted) {return}
        await Axios.get("http://localhost:3001/buchung/byVermieterID/" + this.state.UserID).then((response) => {
            this.setState({data: response.data});                     
        })
    
        let t = this.state.data.slice();
        for (let i=0; i<this.state.data.length; i++){
            await Axios.get("http://localhost:3001/zimmer/" + this.state.data[i].ZimmerIDfk).then((response) => {
                t[i].ZimmerID = t[i].ZimmerIDfk;            //ZimmerID speichern
                zimmertitel[i] = response.data[0].Titel //ZimmerIDfk ist TITEL nicht ZimmerIDfk
            }).catch(function(error) {
                console.log("Fatal Error!")
            })
        }
        await this.setState({data: t});
    }
       
    /**
     * 
     * @param {buchungsAnnahme} event Statusänderung von ausstehend auf akzeptiert
     * durch Button
     */

    buchungsAnnahme = (event) => {
        if(this.state.data[event.target.id].Status === "ausstehend"){                                                                   //Prüfen ob ausstehend
            aenderungStatus.BuchungID = this.state.data[event.target.id].BuchungID;
            aenderungStatus.Status = "akzeptiert";
            Axios.patch("http://localhost:3001/buchung/status", aenderungStatus);
            Mail.buchungBestaetigung(this.state.data[event.target.id].ErstellerIDfk);
        }
    }

    /**
     * 
     * @param {buchungsAblehnen} event Statusänderung von ausstehend auf abgelehnt
     * durch Button
     */

    buchungsAblehnen = (event) => {
        if(this.state.data[event.target.id].Status === "ausstehend"){                                                                   //Prüfen ob ausstehend
            aenderungStatus.BuchungID = this.state.data[event.target.id].BuchungID;
            aenderungStatus.Status = "abgelehnt";
            Axios.patch("http://localhost:3001/buchung/status", aenderungStatus);
            Mail.buchungAblehnung(this.state.data[event.target.id].ErstellerIDfk);
        }      
    }

    zurueck = (event)=> (
        this.props.history.push('/Vermieter') 
    )

    button(index, Status, Ende){
        
        return(
            <td className="px-4 py-2 border">
                {(Status === 'ausstehend')&&(<button className="btn ml-10 mt-2 " id={index} onClick={this.buchungsAnnahme}>Annehmen</button>)}
                {(Status === 'ausstehend')&&(<button className="btn ml-10 mt-2 mb-2" id={index} onClick={this.buchungsAblehnen}>Ablehnen</button>)}
                {(this.checkDate(Ende, Status)) && ( <button className="btn ml-10" onClick={this.bewerten}>Bewerten</button>)}
            </td>
        )               
    }

    datum(Datum){
        let format = new Date(Datum);
        let dd = String(format.getDate()).padStart(2, '0');
        let mm = String(format.getMonth() + 1).padStart(2, '0'); 
        let yyyy = format.getFullYear();

        format = dd + '.' + mm + '.' + yyyy;
        return(format)
    }

    /**
     * Überprüfung ob eine Bewertung für den Benutzer schon abgegeben wurde, setzen eines Booleans
     * Verhindert eine erneute Bewertungsabgabe
     */

    renderData() {
        return this.state.bwdata.map((bewertung, index) => {
            const {AnzahlSterne, ZimmerIDfk, BesitzerIDfk, BuchungIDfk} = bewertung
            if((BuchungIDfk === this.state.BuchungID) && (BesitzerIDfk === this.state.ErstellerIDfk)){
                stop = false
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
                 {this.button(index, Status, Ende)}
              </tr>
           )
        })
     }  


   bewerten = (event) => {
    this.props.history.push(
        '/Bewertung/?id=' + this.state.BuchungID + '&vermieterbw'
        ) 
}

     /**
      * Ermöglicht die Option bewerten unter bestimmten Voraussetzungen
      * Option bewerten - Reise wurde angetreten, das Enddatum ist erreicht und es existiert noch keine Bewertung
      * 
      * @param {string} Ende Enddatum der Buchung/Reise
      * @param {string} Status Buchungsstatus (akzeptiert, ausstehend, abgelehnt, vom Nutzer storniert)
      * @returns boolean true - Anzeige Button, false - kein Anzeigen der Button
      * 
      */

     checkDate(Ende, Status){
         this.renderData();
        let heute = new Date();
        let dd = String(heute.getDate()).padStart(2, '0');
        let mm = String(heute.getMonth() + 1).padStart(2, '0'); //Januar ist 0
        let yyyy = heute.getFullYear();
        heute = (yyyy + '-' + mm + '-' + dd);

        let Endekurz = Ende.substring(0, Ende.indexOf('T'));

        let ende = new Date(Endekurz);
        let d = String(ende.getDate()+1).padStart(2, '0');
        
        let m = String(ende.getMonth() + 1).padStart(2, '0'); //Januar ist 0
        let y = ende.getFullYear();
        ende = (y + '-' + m + '-' + d);
        if(((ende <= heute) && (Status === 'akzeptiert') && (stop === true))){ 
            return true;
        
        }
        stop = true
        return false;
        
    }

    render(){
        if(this.state.auth && (this.state.Rolle === 'Vermieter'))
        {
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
                            <th className="px-4 py-2 border"><b></b></th>
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

export default BuchungshistorieV;
