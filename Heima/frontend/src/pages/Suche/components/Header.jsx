import React from 'react';
import { withRouter } from 'react-router-dom';
import logo from '../../Start/components/img/LogoTextBackground.png'



class Header extends React.Component {
 

  anmelden = (event)=> (
    this.props.history.push(
        '/Anmelden'
        ) 
  )

  home = (event)=> (
    this.props.history.push(
        '/'
        ) 
  )

 


  render(){
 
  
    return( 

      <div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
        />
        <link rel="stylesheet" href="../../Start/Start.css" />
        <nav className="navbar page">
          <div className="nav-center">
       
            <div>
          
              <ul className="nav-links">
                <li>
                  <img id="logo" className="h-10 rounded-lg shadow-xl" onClick={this.home} src={logo} alt="Bild" />
                  </li>
                  <li>
                    <p className="nav-link"></p>
                  </li>
                  <li>
                    <a href="/" id="homebutton"  className="nav-link" onClick={this.home}>
                      home
                    </a>
                  </li>
                  <li>
                    <a id="loginbt" href="Anmelden" className="nav-link" onClick={this.anmelden}>
                        login
                    </a>
                  
                  </li>
                    
                 
                  <li>
                    <a id="aboutbt" href="/#" className="nav-link">
                      about
                    </a>
                  </li>
              </ul>
          </div>
        </div>
      </nav>

                
  </div>
    );
}

}

export default withRouter(Header);
