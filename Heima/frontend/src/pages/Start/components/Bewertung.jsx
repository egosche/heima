import React, {useState} from 'react';
import { FaStar } from 'react-icons/fa';
import Axios from 'axios';

/**
 *  Bewertung.jsx bietet die Möglichkeit eine Bewertung für ein genutztes Zimmer oder einen Benutzer abzugeben.
 */


let Anzahl
class Bewertung extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            BewertungID: '',
            AnzahlSterne: '',
            BewertungsZeitpunkt: '',
            ZimmerIDfk: '',
            ErstellerIDfk: '2',
            BesitzerIDfk: '',
            VermieterIDfk: '',
            BuchungIDfk: '',
            UserID: '',
            showDiv: false, 
            bestätigung: false,
            Titel: '',
            Beschreibung: '',
            Verfuegbarkeit: '',
            PreisproNacht: '',
            Zimmerkategorie: '',
            Bild: '',
            Ort: '',
            Strasse: '',
            Hausnummer: '',
            Zusatzleistungen: '',
            Data: []
        }
        handleSterne = handleSterne.bind(this);
        
    }

    async componentDidMount() {
  
        const urlString = window.location.search;
        const urlParam = new URLSearchParams(urlString);
        const myParam = urlParam.get('id');


        Axios.get('http://localhost:3001/buchung/' + urlParam.get('id')).then((response) => {
            this.setState({ZimmerIDfk: response.data[0].ZimmerIDfk});
            this.setState({BesitzerIDfk: response.data[0].VermieterIDfk}); //Vermieter des Zimmer besitzt bewertung
            this.setState({ErstellerIDfk: response.data[0].ErstellerIDfk});
            this.setState({VermieterIDfk: response.data[0].VermieterIDfk});
            this.setState({BuchungIDfk: myParam});

            //Für Userbewertungen
            if((urlParam.has('vermieterbw'))){                
                this.setState({BesitzerIDfk: this.state.ErstellerIDfk}); //Ersteller der Buchung besitzt bewertung
                this.setState({ UserID: this.state.ErstellerIDfk})
                this.setState({ErstellerIDfk: this.state.VermieterIDfk});
            }
            
        })


        Axios.get('http://localhost:3001/zimmer/' + this.state.ZimmerIDfk).then((response) => {
        this.setState({Titel: response.data[0].Titel});
        this.setState({Beschreibung: response.data[0].Beschreibung})
        this.setState({Verfuegbarkeit: response.data[0].Verfuegbarkeit})
        this.setState({PreisproNacht: response.data[0].PreisproNacht.toFixed(2)})
        this.setState({Zimmerkategorie: response.data[0].Zimmerkategorie})
        this.setState({Bild: response.data[0].Bild})
        this.setState({Ort: response.data[0].Ort})
        this.setState({Strasse: response.data[0].Strasse})
        this.setState({Hausnummer: response.data[0].Hausnummer})
        this.setState({Zusatzleistungen: response.data[0].Zusatzleistungen})
        this.setState({Data: response.data});
    })
    }


    handleBewertungsZeitpunktChange = (event) => {
        let heute = new Date();
        let dd = String(heute.getDate()).padStart(2, '0');
        let mm = String(heute.getMonth() + 1).padStart(2, '0'); 
        let yyyy = heute.getFullYear();

        heute = yyyy + '.' + mm + '.' + dd;
        this.state.BewertungsZeitpunkt = heute
        
    }


    bewerten = (event)=> {
        this.state.AnzahlSterne = Anzahl
        this.handleBewertungsZeitpunktChange();
     
        
        if((this.state.AnzahlSterne&&this.state.BewertungsZeitpunkt&&this.state.ZimmerIDfk&&this.state.ErstellerIDfk&&this.state.BesitzerIDfk&&this.state.BuchungIDfk)!== ''){

            Axios.post("http://localhost:3001/bewertung",this.state);
            this.setState({bestätigung: true})
           
        }
        else {
            console.log('Fehlerhafte Eingabe');
            this.setState({bestätigung: false})


        }
    }


    zurueck = (event)=> (
    
            this.props.history.push(
                '/Vermieter/Buchungshistorie'
                ) 
    )


    handleSterneChange = (bewertungValue) => {
        Anzahl = bewertungValue;
       
    }

    render() {
        const { showDiv } = this.state

        return ( 

            <div>
                <div>
                    <section className="single-product">
                        <div className="section-center single-product-center">
                            <article className="single-product-info">
                                <div>
                                    <p className="single-product-desc">
                                    <div>
                                        <p className="single-product-desc">
                                            <b>{this.state.Titel}</b><br />
                                            <output>{this.state.Ort}, {this.state.Strasse} {this.state.Hausnummer}</output><br />
                                            <output id="1ausgabe">{this.state.Beschreibung}</output><br />  
                                        </p>
                                    </div>
                                    <p className="my-10">Bewertung abgeben:</p>
                                    <BewertungStern/>  
                                        <div>
                                            <button id="bewertenbt" className="addToCartBtn btn mt-16" data-id="id" onClick={() => {this.bewerten(); this.setState({ showDiv: !showDiv })}}>
                                                bewerten
                                            </button>
                                        </div>
                                    </p>           
                                </div>
                            </article>
                        </div>
                    </section>  
                </div>
                
                { showDiv && ( 
                    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800">
                        <div className="bg-white rounded-lg w-1/2">
                            <div className="flex flex-col items-start p-4">
                                <div className="flex items-center w-full">
                                    <div className="text-gray-900 font-medium text-lg">{ this.state.bestätigung ? 'Bestätigung' : 'Fehler' }</div>
                                
                                </div>
                            
                                <div id="3ausgabe" className="">{ this.state.bestätigung ? 'Die Bewertung wurde erfolgreich abgegeben.' : 'Versuchen Sie es später noch einmal. ' }</div>
                            
                                <div className="ml-auto">

                                    {this.state.bestätigung &&    
                                    <button id="2close" className="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={this.zurueck}>
                                    Close
                                    </button>
                                    }
                                    {!(this.state.bestätigung) &&    
                                    <button id="3close" className="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => this.setState({ showDiv: !showDiv })}>
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


export default Bewertung;


function handleSterne(bewertungValue) {
    this.handleSterneChange(bewertungValue);      
}

export const BewertungStern = () =>{
    const [bewertung, setBewertung] = useState(null);
    const [hover, setHover] = useState(null);
   

    return( 
        <div>
            <div className="flex content-start ml-2 mb-4 mt-2"> 
            <p>miserabel</p>
                {[...Array(5)].map((star, position) =>{
                    const bewertungValue= position + 1;
                    return(
                        <div>
                        <label>
                            <input id="sterne" type="radio" name="bewertung"
                            className="invisible" value={bewertungValue} 
                            onClick={()=> setBewertung(bewertungValue)}/>
                            <FaStar id="5stern" className="cursor-pointer" color={bewertungValue <= (hover || bewertung) ? "#ffc107" : "#000000"} 
                            size={30}
                            onMouseEnter={() => {setHover(bewertungValue); handleSterne(bewertungValue); console.log("bewertungValueMouseEnter:" + bewertungValue)}}
                            onMouseLeave={() => {setHover(null); console.log("bewertungValueMouseLeave:" + bewertungValue)}}/>
                        </label>
                        </div>
                    );
                })}
                <p>sehr gut</p>
            </div>
        </div>
        
    );
};
