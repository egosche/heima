import React from 'react';
import Axios from 'axios';
import Header from "../../Suche/components/Header"
import Mail from "../../../Mail"

class Buchung extends React.Component{
    state = {
        BuchungID: '',
        ErstellerIDfk: '',
        ZimmerIDfk: '',
        Status: '',
        Anfang: '',
        Ende: '',
        Buchungszeitpunkt:'',
        PreisproNacht: '',
        Zusatzleistungen: 'Minibar',
        Preis: '',
        showDiv: false, 
        bestätigung: false,
        Rolle: '',
        auth: 0,
        VermieterIDfk: '',
        Titel: '',
        Adresse: '',
        Tage: ''
    }

    async componentDidMount() {
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response) {
            this.setState({auth: 1})
            this.setState({ErstellerIDfk: response.data})
            await Axios.get("http://localhost:3001/user/byID/" + this.state.ErstellerIDfk).then((res) => {
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
            const urlString = window.location.search;
            const urlParam = new URLSearchParams(urlString);
    
            await Axios.get('http://localhost:3001/zimmer/' + urlParam.get('id')).then((response) => {
                this.setState({Preis: response.data[0].PreisproNacht});
                this.setState({ZimmerIDfk: response.data[0].ZimmerID});
                this.setState({VermieterIDfk: response.data[0].VermieterIDfk});
                this.setState({Titel: response.data[0].Titel});
                this.setState({Adresse: response.data[0].Ort + " " +  response.data[0].Strasse + " " +  response.data[0].Hausnummer + ", " + response.data[0].Land});
                console.log(response.data[0].VermieterIDfk)
            })
        }
        else{
            this.props.history.push('/Anmelden')
        }
    }

    handleStatusChange = (event) => {
        let status = "ausstehend";
        this.setState({Status: status});
    }

    handleAnfangChange = (event) => {
        this.setState({Anfang: event.target.value}, () => {
            this.handlePreisproNachtChange();
          }); 
    }

    handleEndeChange = (event) => {
        this.setState({ Ende: event.target.value }, () => {
            this.handlePreisproNachtChange();
            this.handleStatusChange();
            this.handleBuchungszeitpunktChange();
          }); 
    }

    handleBuchungszeitpunktChange = (event) => {
        let heute = new Date();
        let dd = String(heute.getDate()).padStart(2, '0');
        let mm = String(heute.getMonth() + 1).padStart(2, '0'); 
        let yyyy = heute.getFullYear();

        heute = yyyy + '-' + mm + '-' + dd;
        this.setState({Buchungszeitpunkt: heute});
    }

    handlePreisproNachtChange = (event) => {
        let date1 = new Date(this.state.Anfang); 
       
        let date2 = new Date(this.state.Ende);
        
        let zeit = date2.getTime() - date1.getTime();
        
        let tage = zeit/ (1000 * 3600 * 24);
        
        this.setState({Tage: tage});
        let ergebnis = tage * this.state.Preis;
        let ergebnisrund = ergebnis.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        this.setState({PreisproNacht: ergebnisrund});
    }

    zurueck = (event)=> (
        this.props.history.push(
            '/Benutzer'
            ) 
    )


    buchen = (event)=> {

        let ergebnisfloat = parseFloat(this.state.PreisproNacht.replace('.', '').replace(',', '.'));
        this.state.PreisproNacht = ergebnisfloat;

        this.setState({bestätigung: false})
        if(((this.state.ErstellerIDfk&&this.state.ZimmerIDfk&&this.state.Status&&this.state.Anfang&&this.state.Ende&&this.state.Buchungszeitpunkt&&this.state.PreisproNacht&&this.state.Zusatzleistungen)!== '') &&
        (this.state.Anfang&&this.state.Ende !== null) && (this.state.Anfang > this.state.Buchungszeitpunkt) && (this.state.Anfang < this.state.Ende)){
            
            Axios.post("http://localhost:3001/buchung",this.state);
            this.setState({bestätigung: true})
            Mail.buchungEingang(this.state.VermieterIDfk, this.state.ErstellerIDfk)

        }
        else if(this.state.Anfang&&this.state.Ende === null) {
            //alert("Geben Sie ein Anfangs- und ein Enddatum ein")
            
        }
        else if((this.state.Anfang <= this.state.Buchungszeitpunkt)) {
            console.log("BuchAnf:" + this.state.Anfang)
            console.log("BuchZpkt:" + this.state.Buchungszeitpunkt)
            
            
        }
        else if(this.state.Anfang > this.state.Ende) {
            console.log("BuchAnf:" + this.state.Anfang)
            console.log("BuchEnde:" + this.state.Ende)
           
            
        }
        else {
            console.log('Fehlerhafte Eingabe')
            
        }
      
    }


    render(){
        const { showDiv } = this.state
        console.log(showDiv)
        return (
            <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                <div>
                    <Header/>
                </div>
                <div>
                    <h2 className="mt-8 ml-4">Buchung für {this.state.Titel}</h2>
                    <h3 className="mt-8 ml-4">in {this.state.Adresse}</h3>
                </div>
                <div className="ml-4">
                    <form action="/Buchung">
                        <label>Anreise:</label>
                        <input id="anreiseinput" className="ml-10 mt-10 border-2" type="date" onChange ={this.handleAnfangChange}/>
                    </form>
                </div>
                <div className="ml-4">
                    <form action="/Buchung">
                        <label>Abreise:</label>
                        <input id="abreiseinput" className="ml-10 mt-4 border-2" type="date" onChange={this.handleEndeChange}/>
                    </form>
                </div>
                <div className="mt-8 ml-4">
                    <h4>Preis für {this.state.Tage} Nacht/Nächte: {this.state.PreisproNacht + "€"}</h4>
                </div>
                <button id="buchenbt" className="addToCartBtn btn ml-32 mt-4" data-id="id" onClick={() => {this.buchen(); this.setState({ showDiv: !showDiv })}} >
                        buchen
                </button>
                
                { showDiv && ( 
                    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800">
                        <div className="bg-white rounded-lg w-1/2">
                            <div className="flex flex-col items-start p-4">
                                <div className="flex items-center w-full">
                                    <div className="text-gray-900 font-medium text-lg">{ this.state.bestätigung ? 'Bestätigung' : 'Fehler' }</div>
                                </div>
                                <div id="4ausgabe" className="">{ this.state.bestätigung ? 'Die Buchungsanfrage wurde erfolgreich gestellt.' : 'Geben Sie ein gültiges Anreise- und Abreisedatum ein. ' }</div>
                                <div className="ml-auto">
                                    {this.state.bestätigung &&    
                                    <button id="4closebt" className="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={this.zurueck}>
                                    Close
                                    </button>
                                    }
                                    {!(this.state.bestätigung) &&    
                                    <button id="5closebt" className="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => this.setState({ showDiv: !showDiv })}>
                                    Close
                                    </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>)}

                
            </div>
        );
    }
}
export default Buchung;