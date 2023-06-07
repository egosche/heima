import React from 'react';
import { withRouter } from 'react-router-dom';



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
            <link rel="stylesheet" href="../Start.css" />
            <nav className="navbar">
            <div className="nav-center">
              
              <div>
          
                <ul className="nav-links">
                  <li>
                    <a id="homebutton" href="/" className="nav-link"  onClick={this.home}>
                      home
                    </a>
                  </li>
                  <li>
                    <a href="/#" className="nav-link">
                      about
                    </a>
                  </li>
                </ul>
              </div>
       
      
     
        
              </div>
            </nav>
   
            <section className="hero">
              <div className="hero-container">
                <h1 className="text-slanted">
                  willkommen zu heima
                </h1>
                <a href="/Anmelden" id='anmeldenb' className="hero-btn" onClick={this.anmelden}>
                  anmelden
                </a>
              </div>
            </section>

  



                    
          </div>
        );
    }

}

export default withRouter(Header);