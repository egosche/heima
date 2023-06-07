import React from 'react';
import Axios from 'axios';
import Header from "../Suche/components/Header"
import Bewertung from "./../Start/components/BewertungStatisch"


class ZimmerDetails extends React.Component{
  
    state = {
        ZimmerID: '2',
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



    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search)
        await this.setState({ZimmerID: params.get('id')});
        console.log("ZimmerIDMount:" + this.state.ZimmerID)

        Axios.get('http://localhost:3001/zimmer/' + this.state.ZimmerID).then((response) => {
            this.setState({Titel: response.data[0].Titel});
            this.setState({ZimmerID: response.data[0].ZimmerID});
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


    zurueck = (event)=> (
        this.props.history.push(
            '/'
            ) 
    )


    buchen = (event)=> (
        this.props.history.push(
            '/Buchung/?id=' + this.state.ZimmerID
            ) 
      )


    render(){
        return (
            <div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                
                <div>
                    <Header/>
                </div>


                <section className="single-product">
                <div className="section-center single-product-center">
                    <img id="zimmerimg"
                    src={this.state.Bild}
                    className="single-product-img img"
                    alt=""
                    />
                    <article className="single-product-info">
                        <div>
                            <h2 className="single-product-title">{this.state.Ort}</h2>
                            
                            <p className="single-product-price">{this.state.PreisproNacht + " €"}</p>
                            <p className="single-product-desc"></p>
                            <div className="single-product-colors">Ø bisherigen Bewertungen:</div>

                            <Bewertung/>
                            
                                <p className="single-product-desc">
                                    <b>Zimmerdetails zu {this.state.Titel}:</b><br />
                                    <output id="beschreibungoutput">{this.state.Beschreibung}</output><br />
                                    <output>{this.state.Verfuegbarkeit}</output><br />
                                    <output>{this.state.PreisproNacht + " €"} </output><br />
                                    <output>{this.state.Zimmerkategorie}</output><br />
                                    <output>{this.state.Ort}</output><br />
                                    <output>{this.state.Strasse}</output><br />
                                    <output>{this.state.Hausnummer}</output><br />
                                    <output>{this.state.Zusatzleistungen}</output>
                                </p>
                                <button id="zimmerdetbuchenbt" className="addToCartBtn btn" data-id="id" onClick={this.buchen}>
                                buchen
                                </button>
                                <button id="zimmerdetzurueckbt" className="addToCartBtn btn ml-4" onClick={this.zurueck}>
                                    Zurück
                                </button>
                                
                        </div>
                    </article>
                </div>
                </section>
                
            </div>
        );
    }
}

export default ZimmerDetails;
