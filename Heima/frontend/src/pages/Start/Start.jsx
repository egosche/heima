import React from 'react';
import Header from "./components/HeaderStart";
import SearchBar from "./components/SearchBar";
import Deals from "./components/Deals";
import './Start.css'

class Start extends React.Component {


    render(){
        return(
            <div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                <div>
                    <Header />

                </div>
                
                <div>
                    <SearchBar/>

                </div>

                <div>
                    <Deals/>

                </div>
            </div>
        );
    }
}

export default Start;