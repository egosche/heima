import Axios from 'axios';

/**
 * Ermöglicht das versenden von EMails
 */

var mailOptions = {
  from: 'real_heima@yahoo.com',
        to: '',
        subject: '',
        text: ''
}

async function buchungBestaetigung(BenutzerID){

  await Axios.get("http://localhost:3001/user/byID/" + BenutzerID).then((response) => {
    mailOptions.to = response.data[0].EMailAdresse;           
  })        
  mailOptions.subject="Buchungsbestätigung";
  mailOptions.text="Sehr geehrter Heima Kunde,\nWir freuen uns Ihnen mitteilen zu können, dass Ihre Buchung vom Vermieter angenommen wurde. Wir wüschen einen schönen Aufenthalt\nMit freundlichen Grüßen!\nDas HEIMA-Team"
  await Axios.post("http://localhost:3001/email/", mailOptions)
}

async function buchungAblehnung(BenutzerID){

  await Axios.get("http://localhost:3001/user/byID/" + BenutzerID).then((response) => {
    mailOptions.to = response.data[0].EMailAdresse;           
  })        
  mailOptions.subject="Buchungsablehnung";
  mailOptions.text="Sehr geehrter Heima Kunde,\nWir bedauern sehr Ihnen mitteilen zu müssen, dass Ihre Buchung vom Vermieter abgelehnt wurde. Vielleicht werden Sie ja bei einem der anderen Angebote auf unserer Seite fündig\nMit freundlichen Grüßen!\nDas HEIMA-Team"
  await Axios.post("http://localhost:3001/email/", mailOptions)
}
  
async function buchungEingang(VermieterID, BenutzerID){
  //Benutzer
  await Axios.get("http://localhost:3001/user/byID/" + BenutzerID).then((response) => {
    mailOptions.to = response.data[0].EMailAdresse;            
  })
  mailOptions.subject="Buchungseingang";
  mailOptions.text="Sehr geehrter Heima Kunde,\nIhre Buchung ist bei uns eingegangen.\nBitte geben Sie dem Vermieter etwas Zeit, um die Buchung zu bearbeiten.\nMit freundlichen Grüßen!\nDas HEIMA-Team";
  await Axios.post("http://localhost:3001/email/", mailOptions)

  //Vermieter
  await Axios.get("http://localhost:3001/user/byID/" + VermieterID).then((response) => {
    mailOptions.to = response.data[0].EMailAdresse;            
  })
  mailOptions.text="Sehr geehrter Heima Kunde,\nfür ein Zimmer ist eine Buchung bei uns eingegangen.\nBitte nehmen Sie sich etwas Zeit, um die Buchung zu bearbeiten.\nMit freundlichen Grüßen!\nDas HEIMA-Team";
  await Axios.post("http://localhost:3001/email/", mailOptions)
}

async function stornierung(VermieterID, BenutzerID){

  //Benutzer
  await Axios.get("http://localhost:3001/user/byID/" + BenutzerID).then((response) => {
    mailOptions.to = response.data[0].EMailAdresse;            
  })
  mailOptions.subject="Sornierung";
  mailOptions.text="Sehr geehrter Heima Kunde,\nhiermit bestätigen wir Ihnen die Stornierung Ihrer Buchung.\nVieleciht finden Sie auf unserer Webseite ein neues passendes Angebot.\nMit freundlichen Grüßen!\nDas HEIMA-Team";
  await Axios.post("http://localhost:3001/email/", mailOptions)

  //Vermieter
  await Axios.get("http://localhost:3001/user/byID/" + VermieterID).then((response) => {
    mailOptions.to = response.data[0].EMailAdresse;            
  })
  mailOptions.subject="Sornierung";
  mailOptions.text="Sehr geehrter Heima Kunde,\nwir bedauern sehr Ihnen mitteilen zu müssen das ein Kunde eine Buchung bei Ihnen storniert hat.\nFür weitere Informationen zur Buchung besuchen Sie bitte Ihre Buchungshistorie.\nMit freundlichen Grüßen!\nDas HEIMA-Team";
  await Axios.post("http://localhost:3001/email/", mailOptions)
}

/**
 * Besonderheit bei dieser Funktion!
 * hier wird die Mailadresse direkt übergeben und keine ID
 */
async function registrierung(email){
  
  mailOptions.to = email
  mailOptions.subject = "Registrierung bei HEIMA"
  mailOptions.text = "Herzlich Willkommen bei HEIMA!\nIhre Registrierung wurde erfolgreich abgeschlossen. Sie können sich nun auf unserer Webseite anmelden.\nMit freundlichen Grüßen\nDas HEIMA-Team"
  await Axios.post("http://localhost:3001/email/", mailOptions)


}

export default {buchungBestaetigung, buchungEingang, buchungAblehnung, stornierung, registrierung};