
import { cleanup,render, fireEvent, waitFor, } from '@testing-library/react';
import App from './App';
import React from 'react';




//unit  testing
test('Überprüfen ob die Seiten richtig geladen werden beim rendern', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  fireEvent.click(document.getElementById('homebutton'));
  getByText("willkommen zu heima");
  getByText("anmelden");
  getByText("about");
  getByText("buchen");
  
  debug()
});
test('unit test buchen seite ohne router', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  fireEvent.click(document.getElementById('homebutton'));
  fireEvent.click(document.getElementById('bucher'));
  getByText("Anreise:");
  getByText("Abreise:");
  getByText("buchen");
 
  fireEvent.click(document.getElementById('homebutton'));
  debug()
});


test('unit test anmelden ohne router', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  fireEvent.click(document.getElementById('homebutton'));
  fireEvent.click(document.getElementById('anmeldenb'));
  getByText("Schließen");
  getByText("Anmelden");
  getByText("Email-Adresse");
  getByText("Passwort");
  getByText("Noch kein Konto?");
  fireEvent.click(document.getElementById('closebt'));
  
 
  
  debug()
});
test('unit test benutzer seite ohne router', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  const emailb="test";
  const passwortb="test";
  await waitFor(()=>fireEvent.click(document.getElementById("homebutton")));
  await waitFor(()=>fireEvent.click(document.getElementById("anmeldenb")));//button auf der homepage
  fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}});
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await waitFor(()=>fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}}));
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await fireEvent.click(document.getElementById('anmeldenbt'));//button auf der extra seite
  getByText("Buchungshistorie ansehen");
  getByText("Profil erstellen");
  getByText("Select...");
  getByText("buchen");
  fireEvent.click(document.getElementById('closebt'));
  
  debug()
});
test('unit test buchungshistorie seite ohne router', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  fireEvent.click(document.getElementById('homebutton'));
  fireEvent.click(document.getElementById('anmeldenb'));
  const emailb="test";
  const passwortb="test";
  await waitFor(()=>fireEvent.click(document.getElementById("homebutton")));
  await waitFor(()=>fireEvent.click(document.getElementById("anmeldenb")));//button auf der homepage
  fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}});
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await waitFor(()=>fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}}));
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await fireEvent.click(document.getElementById('anmeldenbt'));//button auf der extra seite
  fireEvent.click(document.getElementById('buchungshistoriebt'));
  getByText("BuchungID");
  getByText("Titel");
  getByText("Status");
  getByText("Preis");
  getByText("Anfang");
  getByText("Ende");
  getByText("Buchungszeitpunkt");
  getByText("Zusatzleistungen");
  fireEvent.click(document.getElementById('closebt'));
  //getByLabelText("Stornieren")
  
  debug()
});
test('unit test Profil seite ohne router', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  fireEvent.click(document.getElementById('homebutton'));
  fireEvent.click(document.getElementById('anmeldenb'));
  const emailb="test";
  const passwortb="test";
  await waitFor(()=>fireEvent.click(document.getElementById("homebutton")));
  await waitFor(()=>fireEvent.click(document.getElementById("anmeldenb")));//button auf der homepage
  fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}});
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await waitFor(()=>fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}}));
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await fireEvent.click(document.getElementById('anmeldenbt'));//button auf der extra seite
  fireEvent.click(document.getElementById('profilerstellenbt'));
  getByText("Erstellen");
  getByText("Zurück");
  fireEvent.click(document.getElementById('closebt'));
 
  
  debug()
});

//kein unit testing mehr
test('Überprüfen von clicks', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  const rightClick = { button: 2 };
//  render(<Header/>)
fireEvent.click(document.getElementById('homebutton'));
fireEvent.click(document.getElementById('1searchbt'));
await waitFor(() => getByText("Keine Zimmer gefunden!"));
//console.log(document.getElementById("homebutton"));
await waitFor(()=>fireEvent.click(document.getElementById("homebutton")));
fireEvent.click(document.getElementById('1searchbt'),rightClick);




});
/**eingabe von text spandau in suchfeld über den query selector **/
test('Überprüfen von input in Feldern', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  const input = document.querySelector("div.css-b8ldur-Input div input");
 const todoText="Spandau";
//console.log(input);
 fireEvent.change(input,{target:{value:todoText}});
 await fireEvent.click(document.getElementById("1searchbt"));
 //fireEvent.keyPress(input,{key:'enter',code:'Keyenter'});
 
 await waitFor(() => getByText("Keine Zimmer gefunden!"));

});

test('Überprüfen von Anmeldefunktion', async() => {
const {getByText,getByLabelText,debug}= render (<App />);
const emailv="volkibau@gmx.com";
const passwortv="Volker";
const emailb="vilivé@gmail.com";
const passwortb="Vilver";
await waitFor(()=>fireEvent.click(document.getElementById("homebutton")));
await waitFor(()=>fireEvent.click(document.getElementById("anmeldenb")));//button auf der homepage
fireEvent.change(document.getElementById("emailfd"),{target:{value:emailv}});
fireEvent.change(document.getElementById("passwortfd"),{target:{value:passwortv}});
await fireEvent.click(document.getElementById('anmeldenbt'));//button auf der extra seite
getByText("Buchungshistorie ansehen")
});

test('click auf die about seite', async() => {
  const {getByText,getByLabelText,debug}= render (<App />);
  fireEvent.click(document.getElementById('homebutton'));
  fireEvent.click(document.getElementById('aboutbt'));
  
});
/**clicken durch die seite   **/
test('Überprüfen der stornier funktion', async() => {
  const {getByText,getByLabelText,debug}=render(<App />);
  fireEvent.click(document.getElementById('homebutton'));
  fireEvent.click(document.getElementById('anmeldenb'));
  const emailb="test";
  const passwortb="test";
  await waitFor(()=>fireEvent.click(document.getElementById("homebutton")));
  await waitFor(()=>fireEvent.click(document.getElementById("anmeldenb")));//button auf der homepage
  fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}});
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await waitFor(()=>fireEvent.change(document.getElementById("emailfeld"),{target:{value:emailb}}));
  fireEvent.change(document.getElementById("passwortfeld"),{target:{value:passwortb}});
  await fireEvent.click(document.getElementById('anmeldenbt'));//button auf der extra seite
  fireEvent.click(document.getElementById('buchungshistoriebt'));
  //fireEvent.click(document.getElementById('stornierenbt')); funktioniert nicht,da ich keine url mitgebe 
  debug();
});


afterEach(cleanup);

/*
const {getByText,getByLabelText,debug}= render (<App />);
const emailv="testv";
const passwortv="testv";
const emailb="test";
const passwortb="test";
await waitFor(()=>fireEvent.click(document.getElementById("homebutton")));
await waitFor(()=>fireEvent.click(document.getElementById("anmeldenb")));//button auf der homepage
fireEvent.change(document.getElementById("emailfd"),{target:{value:emailb}});
fireEvent.change(document.getElementById("passwortfd"),{target:{value:passwortb}});
await fireEvent.click(document.getElementById('anmeldenbt'));//button auf der extra seite
fireEvent.change(document.getElementById("emailfd"),{target:{value:emailv}});
fireEvent.change(document.getElementById("passwortfd"),{target:{value:passwortv}});*/