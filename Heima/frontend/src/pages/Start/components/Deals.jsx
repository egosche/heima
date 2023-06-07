import React from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';

/**
 *  Anzeige eines Beispielzimmers erfolgt bereits auf der Startseite
 */

 var mounted = 0;

class Deals extends React.Component {

  state = {
    ZimmerID: '1',
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
  
    mounted = 1;
    Axios.get('http://localhost:3001/zimmer/').then((response) => {
        mounted && this.setState({Titel: response.data[0].Titel});
        mounted && this.setState({ZimmerID: response.data[0].ZimmerID});
        mounted && this.setState({Beschreibung: response.data[0].Beschreibung})
        mounted && this.setState({Verfuegbarkeit: response.data[0].Verfuegbarkeit})
        mounted && this.setState({PreisproNacht: response.data[0].PreisproNacht.toFixed(2)})
        mounted && this.setState({Zimmerkategorie: response.data[0].Zimmerkategorie})
        mounted && this.setState({Bild: response.data[0].Bild})
        mounted && this.setState({Ort: response.data[0].Ort})
        mounted && this.setState({Strasse: response.data[0].Strasse})
        mounted && this.setState({Hausnummer: response.data[0].Hausnummer})
        mounted && this.setState({Zusatzleistungen: response.data[0].Zusatzleistungen})
        mounted && this.setState({Data: response.data});
    })
}

componentWillUnmount(){
    mounted = 0;
}

buchen = (event)=> (
    this.props.history.push(
        '/Buchung/?id=' + this.state.ZimmerID
        ) 
  )


render(){
  return (
      <div>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
          
          
          <section className="single-product">
          <div className="section-center single-product-center">
              <img
              src={this.state.Bild}
              className="single-product-img img"
              alt=""
              />
              <article className="single-product-info">
                  <div>
                      <h2 className="single-product-title">{this.state.Ort}</h2>
                      <p className="single-product-company text-slanted">
                          
                      </p>
                      <div className="flex content-start">
                        <p className="single-product-price">{this.state.PreisproNacht + " €"} </p>
                        



                    </div>
                        <div className="single-product-colors"></div>
                            <p className="single-product-desc">
                                <b>Zimmerdetails zu {this.state.Titel}:</b><br />
                                <output id="1ausgabe">{this.state.Beschreibung}</output><br />
                                <output>{this.state.Verfuegbarkeit}</output><br />
                                <output>{this.state.PreisproNacht + " €"}</output><br />
                                <output>{this.state.Zimmerkategorie}</output><br />
                                <output>{this.state.Ort}</output><br />
                                <output>{this.state.Strasse}</output><br />
                                <output>{this.state.Hausnummer}</output><br />
                                <output>{this.state.Zusatzleistungen}</output>
                            </p>
                            <button className="addToCartBtn btn" data-id="id" id="bucher" onClick={this.buchen}>
                                buchen
                            </button>
                         
                  </div>
              </article>
          </div>
          </section>
          
      </div>
  );
}
}

    
export default withRouter(Deals);