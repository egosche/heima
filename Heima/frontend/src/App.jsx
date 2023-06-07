import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Start from './pages/Start/Start'
import VStart from './pages/Vermieter_start/Vstart'
import ZimmerEinpflegen from './pages/ZimmerEinpflegen/ZimmerEinpflegen'
import ZimmerV from './pages/ZimmerVerwalten/ZimmerV'
import Suche from './pages/Suche/Suche'
import BStart from './pages/Benutzer_start/Bstart'
import Anmelden from './pages/Start/components/Anmelden'
import ZimmerDetails from './pages/ZimmerDetails/ZimmerDetails'
import Buchung from './pages/Start/components/Buchung'
import BuchungshistorieV from './pages/BuchungshistorieV/BuchungshistorieV'
import BuchungshistorieM from './pages/BuchungshistorieM/BuchungshistorieM'
import ZimmerBearbeiten from './pages/ZimmerBearbeiten/ZimmerBearbeiten'
import Profil from './pages/Profil/Profil'
import ProfilBearbeiten from './pages/ProfilBearbeiten/ProfilBearbeiten'
import ProfilErstellen from './pages/ProfilErstellen/ProfilErstellen';
import Bewertung from './pages/Start/components/Bewertung'
import Registrierung from './pages/Start/components/Registrierung'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Start} />
        <Route path='/Vermieter' exact component={VStart} />
        <Route path='/Vermieter/Buchungshistorie' exact component={BuchungshistorieV}/>
        <Route path='/Zimmer/Einpflegen' component={ZimmerEinpflegen}/>
        <Route path='/Zimmer/Details' component={ZimmerDetails}/>
        <Route path='/Zimmer/Bearbeiten' component={ZimmerBearbeiten}/>
        <Route path='/Zimmerbestand' component={ZimmerV} />
        <Route path='/Suche' component={Suche} />
        <Route path='/Benutzer' exact component={BStart}/>
        <Route path='/Benutzer/Buchungshistorie' exact component={BuchungshistorieM}/>
        <Route path='/Benutzer/Profil' exact component={Profil}/>
        <Route path='/Benutzer/Profil/Bearbeiten' exact component={ProfilBearbeiten}/>
        <Route path='/Benutzer/Profil/Erstellen' exact component={ProfilErstellen}/>
        <Route path='/Anmelden' component={Anmelden}/>
        <Route path='/Buchung' component={Buchung}/>
        <Route path='/Bewertung' component={Bewertung}/>
        <Route path='/Registrierung' component={Registrierung}/>

      </Switch>
    </Router>
  );
}

export default App;
