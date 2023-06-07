import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"

/**
 * Zeigt alle Zimmer eines Vermieters an
 */

var mounted = 0;

// Create our number formatter.
var formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

class ZimmerV extends React.Component{
    constructor(props){
        super(props);
        this.state = {
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
            data: [],
            auth: 0,
            Rolle: ''
        }

    }
    
    async loeschenF(id){
        await Axios.delete("http://localhost:3001/zimmer/"+ id).then((response) => {
                console.log(response.data);
                
            })
    }
    
    async componentDidMount() {
        mounted  = 1;
        await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then(async function(response)  {
            this.setState({VermieterIDfk: response.data})
            this.setState({auth: 1})
            await Axios.get("http://localhost:3001/user/byID/" + this.state.VermieterIDfk).then((res) => {
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
        if(this.state.auth && (this.state.Rolle === 'Vermieter')) { 
            this.tick()  
            this.ticker = setInterval(() => this.tick(), 5000);
        }
        else{
            this.props.history.push('/Benutzer')
        }
    }

    tick(){
        Axios.get("http://localhost:3001/zimmer/byVermieterID/"+ this.state.VermieterIDfk).then((response) => {
           
            mounted && this.setState({data: response.data});
        })
    }
    componentWillUnmount(){
        mounted = 0;
    }

    zurueck = (event)=> (
        this.props.history.push('/Vermieter') 
    )
     
    bearbeiten = (event)=>(
        this.setState({ZimmerID: event.target.id}),
        this.props.history.push('/Zimmer/Bearbeiten?id='+ event.target.id)
    )

    loeschen = (event)=>(
        this.setState({ZimmerID: event.target.id}),
        this.loeschenF(event.target.id)
        
    )

    renderTableData() {
        return this.state.data.map((zimmer, index) => {
           const { ZimmerID, Titel, Beschreibung, Verfuegbarkeit, PreisproNacht, Zimmerkategorie, Ort, Land, Strasse, Hausnummer, Zusatzleistungen, Ausstattungsangebot, Anzahl} = zimmer//destructuring
           return (
              <tr key={ZimmerID}>
                 <td className="px-4 py-2 border">{ZimmerID}</td>
                 <td className="px-4 py-2 border">{Titel}</td>
                 <td className="px-4 py-2 border">{Beschreibung}</td>
                 <td className="px-4 py-2 border">{Verfuegbarkeit}</td>
                 <td className="px-4 py-2 border">{formatter.format(PreisproNacht)}</td>
                 <td className="px-4 py-2 border">{Zimmerkategorie}</td>
                 <td className="px-4 py-2 border">{Ort}</td>
                 <td className="px-4 py-2 border">{Land}</td>
                 <td className="px-4 py-2 border">{Strasse+" "+Hausnummer}</td>
                 <td className="px-4 py-2 border">{Zusatzleistungen}</td>
                 <td className="px-4 py-2 border">{Ausstattungsangebot}</td>
                 <td className="px-4 py-2 border">{Anzahl}</td>
                 <td className="px-4 py-2 border">
                   <div>{<button className="btn ml-10 mt-2" id={ZimmerID} onClick={this.bearbeiten}>Bearbeiten</button>} 
                    {<button className="btn ml-10 mt-2 mb-2" id={ZimmerID} onClick={this.loeschen}>Löschen</button>} </div> 
                </td>
              </tr>
           )
        })
     }  

    render(){
        if(this.state.auth){
            return(
                <div>
                    <div>
                        <Header/>
                    </div>

                    <div>
                        <table id= 'table' className="table-fixed shadow-2xl bg-white border-2 border-black m-10" >
                            <thead className="">
                                <th className="px-4 py-2 border"><b>ZimmerID</b></th>
                                <th className="px-4 py-2 border"><b>Titel</b></th>
                                <th className="px-2 py-2 border"><b>Beschreibung</b></th>
                                <th className="px-4 py-2 border"><b>Verfuegbarkeit</b></th>
                                <th className="px-4 py-2 border"><b>Preis/Nacht</b></th>
                                <th className="px-4 py-2 border"><b>Zimmerkategorie</b></th>
                                <th className="px-4 py-2 border"><b>Ort</b></th>
                                <th className="px-4 py-2 border"><b>Land</b></th>
                                <th className="px-4 py-2 border"><b>Strasse</b></th>
                                <th className="px-4 py-2 border"><b>Zusatzleistungen</b></th>
                                <th className="px-4 py-2 border"><b>Ausstattungsangebot</b></th>
                                <th className="px-4 py-2 border"><b>Anzahl</b></th>
                                <th className="px-4 py-2 border"><b></b></th>
                            </thead>
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
        else{
            return(
                <p>Loading...</p>
            )
        }
    }

}

export default ZimmerV;