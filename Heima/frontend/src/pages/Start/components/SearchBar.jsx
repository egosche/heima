import React from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import Select from 'react-select';


/**
 *  SearchBar.jsx ist für die Auswahlmöglichkeiten der Suchleite ('Ort, Land') verantwortlich.
 *  Ermöglicht das Weiterleiten zu den Suchergebnissen.
 */

var mounted = 0

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    border: "none"
  }),
  menu: (provided, state) => ({
    ...provided,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused && "lightgray",
    color: state.isFocused && "gray"
  })

}

const array = [];
class SearchBar extends React.Component {

    state = {
        land: '',
        stadt: '',
        text: '',
        selectedOption: '',
        data: [{
          ZimmerID: '',
          Titel: '',
          Ort: '',
          Land: ''
      }]
    }

   componentDidMount() {

    mounted = 1;
    Axios.get('http://localhost:3001/zimmer/').then((response) => {
         
      mounted && this.setState({data: response.data});
    })


  }

  componentWillUnmount(){
    mounted = 0;
  }

    handleSubmit = (event) => {
      if((this.state.selectedOption !== '') && (this.state.selectedOption !== null)){
        let split = JSON.stringify(this.state.selectedOption)
          this.props.history.push(
              '/Suche?stadt=' + split.split('"label":"')[1].split(', ')[0]
              )  

      } else {
        this.props.history.push(
          '/Suche?stadt=' 
          ) 
      }
    }

    handleChange = selectedOption => {
      
      this.setState(
        { selectedOption },
        () => console.log(`Option selected:`, this.state.selectedOption)
      );
    };

  

  /**
   *  Ausgabe der vorhanden Orte
   *  @returns Mit Orten gefülltes Array 
   */

  renderData() {
    return this.state.data.map((zimmer, index) => {
       const {Ort, Land} = zimmer
      
      if((Ort.length>0) && !(array.some(el => el.label === Ort + ', ' + Land))){
        return (
          array.push({value: Ort + ', ' + Land, label: Ort + ', ' + Land})
          
        )
       }
    })
 } 


    render(){
      const { selectedOption } = this.state;
      if( array.length <= 0){
        this.renderData()
      }
     const uni = [...new Set(array)]
     const unique = [...uni]

        return( 
          <div>
             <div className="p-8 xl:mx-40" >
              <div className="bg-white flex text-center items-center rounded-full shadow-xl">
                <Select id="1selecttf" className=" w-full ml-10 "
                  styles={customStyles}
              
                    value={selectedOption}
                    onChange={this.handleChange}
                   
                    isClearable={true}
                    isSearchable={true}
                    options={unique}
                    />

                  <div className="p-4">
                    <button id="1searchbt" className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center" type="button" onClick={this.handleSubmit}>
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                

              </div>
             
            </div>
          </div>
        


);
}

}

export default withRouter(SearchBar)

