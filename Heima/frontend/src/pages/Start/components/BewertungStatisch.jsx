import React from 'react';
import { FaStar } from 'react-icons/fa';
import Axios from 'axios';


/**
 *  BewertungStatisch.jsx ist das Ausgeben der Bewertungen zuständig.
 */


let durchgang = 0;
let bewertungstern = 0;
const array = [];

class BewertungStatisch extends React.Component {

    state = {
        land: '',
        stadt: '',
        zimmer: '',
        user: '',
        selectedOption: '',
        data: [{
          BewertungID: '',
          AnzahlSterne : '',
          BewertungsZeitpunkt: '',
          ZimmerIDfk: '',
          ErstellerIDfk: '',
          BesitzerIDfk: ''
      }]
    }

    componentDidMount() {
    
    const urlString = window.location.search;
    const urlParam = new URLSearchParams(urlString);
    this.setState({ zimmer: parseInt(urlParam.get('id')) });

    console.log("id:" + urlParam.get("id"));
    
    if (this.state.zimmer === null || typeof this.state.zimmer !== undefined){
        this.setState({ user: parseInt(urlParam.get('userid')) });

    }



    Axios.get('http://localhost:3001/bewertung/').then((response) => {
        this.setState({data: response.data});
      })

    }



    /**
     *  Filtern der Bewertungen nach gesuchtem Zimmer oder gesuchtem Benutzer.
     *  @returns ein mit Bewertungen gefülltes Array
     */


    renderData() {
        var anzahl;
        return this.state.data.map((bewertung, index) => {
           const {AnzahlSterne, ZimmerIDfk, ErstellerIDfk, BesitzerIDfk} = bewertung
            //Zimmer bewerten
            if((ZimmerIDfk === this.state.zimmer) && (ErstellerIDfk !== BesitzerIDfk) && (this.state.user !== BesitzerIDfk)){
                durchgang++;
                anzahl = Number(AnzahlSterne);
                bewertungstern += anzahl;
           return (
            array.push({value: AnzahlSterne, label: AnzahlSterne})
           ) 

           //User bewerten
           } else if ((this.state.user === BesitzerIDfk) && (ErstellerIDfk !== BesitzerIDfk) ){
                durchgang++;
                anzahl = Number(AnzahlSterne);
                bewertungstern += anzahl;
            return (
                array.push({value: AnzahlSterne, label: AnzahlSterne})
                
               )
           } else{
               console.log("ZimmerIDfk nicht gleich zimmer");
           }
        })
     } 




     render(){
       
        durchgang = 0;
        bewertungstern = 0;
        this.renderData();
        var bewertungValue = (bewertungstern/durchgang);

        return(
            <div className="flex content-start ml-2 mb-4 mt-2"> 
            
                        <label>
                            <input id="stern" type="radio" name="bewertung"
                            className="invisible" value={bewertungValue} />
                            <FaStar className="cursor-pointer" color={(1<=bewertungValue) ? "#ffc107" : "#000000"} 
                            size={30}/>
                        </label>
                        <label>
                            <input id="1stern" type="radio" name="bewertung"
                            className="invisible" value={bewertungValue} />
                            <FaStar className="cursor-pointer" color={(2<=bewertungValue) ? "#ffc107" : "#000000"} 
                            size={30}/>
                        </label>
                        <label>
                            <input id="2stern" type="radio" name="bewertung"
                            className="invisible" value={bewertungValue} />
                            <FaStar className="cursor-pointer" color={(3<=bewertungValue) ? "#ffc107" : "#000000"} 
                            size={30}/>
                        </label>
                        <label>
                            <input id="3stern" type="radio" name="bewertung"
                            className="invisible" value={bewertungValue} />
                            <FaStar className="cursor-pointer" color={(4<=bewertungValue) ? "#ffc107" : "#000000"} 
                            size={30}/>
                        </label>
                        <label>
                            <input id="4stern" type="radio" name="bewertung"
                            className="invisible" value={bewertungValue} />
                            <FaStar className="cursor-pointer" color={(5<=bewertungValue) ? "#ffc107" : "#000000"} 
                            size={30}/>
                        </label>
                        <label>
                            <p>{durchgang + " Bewertungen" }</p>
                        </label>
                    
            </div>
        );
    }



}



export default BewertungStatisch;