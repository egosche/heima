import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';


class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      Vorname: '',
      Nachname: '',
      Profilname: '',
      UserID: '',
      Bild: '',
      auth: 0
    }
  }

  
async componentDidMount() {
  await Axios.post("http://localhost:3001/auth/", null, {withCredentials: true}).then((response) =>
  {
    this.setState({UserID: response.data})
    this.setState({auth: 1})

    Axios.get("http://localhost:3001/user/byID/" + this.state.UserID).then((response) => 
    {
      this.setState({Vorname: response.data[0].Vorname});
      this.setState({Nachname: response.data[0].Nachname});          
    }) 
  }).catch(function(error)
  {
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
 



  if (this.state.auth){
    try{
      await Axios.get("http://localhost:3001/profil/byBesitzerId/" + this.state.UserID).then((response) => {
        this.setState({Bild: response.data[0].Profilbild});
      })
    }
    catch(error){
      console.log(error)
      if (error.response.status !== 200) {
        console.log('Kein Bild')
      
    }

    }
  }
}


  render(){
    if (this.state.auth) {
        return( 
          <div className="inline-flex rounded-full pr-4 bg-gray-300 h-16 leading-10 my-10">
            <img id="avatarimg" className="rounded-full float-left h-full" alt="Benutzerbild" src={this.state.Bild}/>
            <span id="avatarspan" className="display: inline-block mt-3 ml-5 text-2xl">{this.state.Vorname} {this.state.Nachname}</span>
          </div>
        );
    }
    else {
      return(
        <p>Loading...</p>
      )
    }
  }

}

export default withRouter(Avatar);