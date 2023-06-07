import React from 'react';
import Axios from 'axios';
import Header from "./components/Header";
import Select from 'react-select';

/**
 *  Suche.jsx ist für das Ausgeben der gesuchten Zimmer verantwortlich.
 *  Das Setzen von Filtern (nach Zimmerkategorie und Preis) wird ermöglicht.
 */

const customStyles = {
    control: (provided, state) => ({
      ...provided
    }),
    menu: (provided, state) => ({
      ...provided
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused && "lightgray",
      color: state.isFocused && "gray"
    })
  
  }

const kategorieArray = [{value: "Einzelzimmer", label: "Einzelzimmer"}, {value: "Doppelzimmer", label: "Doppelzimmer"}];
const preisArray = [{value: "Unter 50", label: "Unter 50 €"}, {value: "Unter 100", label: "Unter 100 €"}, {value: "Unter 200", label: "Unter 200 €"}];


class Suche extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            text: '',
            stadt: '',
            land: '',
            result: '',
            kategorie:'',
            preis:'',
            selectedOption: '',
            ergebnisse: true,
            showDiv: false
        };
     }


     async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search)
        await this.setState({ stadt: params.get('stadt') });
        
        Axios.post('http://localhost:3001/zimmer/search', {
            Stadt: this.state.stadt
        }).then((response) => {
            this.setState({result: response.data});
        });   
    }
   
    
    handleChange = kategorie => {
        this.setState(
          { kategorie },
          () => console.log(`Option selected:`, this.state.kategorie)
        );
      };


      handlePreisChange = preis => {
        this.setState(
          { preis },
          () => console.log(`Option selected:`, this.state.preis)
        );
      };

  



    /**
     *  Einlesen der gesetzten Filter von 'react-select'
     *  @returns Suchergebnisse werden erneuert
     */


    renderResult() {

      if(this.state.ergebnisse || (this.state.kategorie === '' && this.state.preis === '') || (this.state.kategorie === null && this.state.preis === null)){
        if (this.state.result.length === 0) return <h3 className="mt-10 text-center">Keine Zimmer gefunden!</h3>;
        return (
            <div className="featured-center section-center">

                {this.state.result.map(res => <article className="product"><div className="product-container" key={res.ZimmerID}>
                    <img src={res.Bild} className="product-img img" alt="Zimmerbild" />
                    <div className="product-icons">
                        <button className="product-icon" onClick={() => this.moveToDetails(res.ZimmerID)}><i className="fas fa-search"></i></button></div>
                    <footer><p id="1ausgabeTitel" className="product-name">{res.Titel}</p><p className="product-name">{res.Zimmerkategorie}</p>
                    <h4 className="product-price">{' Preis/Nacht: ' + res.PreisproNacht.toFixed(2) + ' € '}</h4> </footer></div></article>)}
            </div>       
        );


      } else{
          if (this.state.result.length === 0) return <h3 className="mt-10 text-center">Keine Zimmer gefunden!</h3>;
          let spliterg
          let split = JSON.stringify(this.state.kategorie)
          if((this.state.kategorie === '') || (this.state.kategorie === null)){
            spliterg = 'zimmer'
          } else{
            spliterg = split.split('"label":"')[1].split('"')[0]
          }
          this.state.ergebnisse = true;
            
          let split1 = JSON.stringify(this.state.preis)
          var money
          if(split1.includes("50")){
            money = 50;
          } else if (split1.includes("100")){
            money = 100;
          } else {
            money = 200;
          }
        
          const arr = this.state.result.filter(ress => (ress.Zimmerkategorie.includes(spliterg))&&(ress.PreisproNacht < money))
          if(!arr.length){ return <h3 className="mt-10 text-center">Keine Zimmer gefunden!</h3>;}
          if((this.state.kategorie === null && this.state.preis === null) || (this.state.kategorie === '' && this.state.preis === '')){
            return <h3 className="mt-10 text-center">Keine Zimmer gefunden!</h3>;
          }
          

          return (
              
              <div className="featured-center section-center">

                  {this.state.result.filter(ress => (ress.Zimmerkategorie.includes(spliterg))&&(ress.PreisproNacht < money)).map(res => <article className="product"><div className="product-container" key={res.ZimmerID}>
                      <img src={res.Bild} className="product-img img" alt="Zimmerbild" />
                      <div className="product-icons">
                          <button className="product-icon" onClick={() => this.moveToDetails(res.ZimmerID)}><i className="fas fa-search"></i></button></div>
                      <footer><p id="2ausgabeTitel" className="product-name">{res.Titel}</p><p className="product-name">{res.Zimmerkategorie}</p>
                      <h4 className="product-price">{' Preis/Nacht: ' + res.PreisproNacht.toFixed(2) + ' € '}</h4> </footer></div></article>)}
              </div>       
          );
      }
      } 


    moveToDetails(zimmerid) {
        this.props.history.push('/Zimmer/Details?id=' + zimmerid) 
    }


    render() { 
        const { preis } = this.state;
        const { showDiv } = this.state;
        const { ergebnisse } = this.state;
        const { kategorie } = this.state;
       

       
        return ( 
            <div>
                <div>
                    <Header/>
                </div>
                    {!showDiv && ( 
                    <nav className="navbar page">
                      <div className="nav-center">
                        <button id="filterbt" className="addToCartBtn btn" data-id="id" onClick={() => this.setState({ showDiv: !showDiv })}>
                          { showDiv ? 'Filter anwenden' : 'Filtern' }
                        </button>
                      </div>
                    </nav>
              )}

                    { showDiv && (  <div className="">
                      <section className="products"> 
                        <div className="filters">
                          <div className="filters-container">   
                            <h4>Kategorie</h4>
                            
                            <Select id="1selectbt" className=" w-full ml-10 "
                                    styles={customStyles}
                                
                                      value={kategorie}
                                      onChange={this.handleChange}
                                    
                                      isClearable={true}
                                      isSearchable={true}
                                      options={kategorieArray}
                                      />

                            <h4>Preis/Nacht</h4>
                            
                            <Select id="2selectbt" className=" w-full ml-10"
                                    styles={customStyles}
                                
                                      value={preis}
                                      onChange={this.handlePreisChange}
                                      isClearable={true}
                                      isSearchable={true}
                                      options={preisArray}
                                      />

                            <button id="2filterbt" className="addToCartBtn btn my-10" data-id="id" onClick={() => this.setState({ ergebnisse: !ergebnisse})}>
                                  { showDiv ? 'Filter anwenden' : 'sieht man nie' }
                            </button>
                          </div>
                        </div>
                      </section>
                </div>)}

                <div>
                    <section className="section featured">
                        <div className="title">
                            <h2><span>Suchergebnisse:  {this.state.stadt} </span></h2>
                        </div>
                        { this.renderResult() }
                    </section>
                </div>
                
            </div>
         );
    }
}
 
export default Suche;