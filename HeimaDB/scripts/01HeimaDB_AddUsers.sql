USE heimadb;
INSERT INTO user (UserID, Vorname, Nachname, Telefonnummer, Sprache, Land, Ort, Hausnummer, Strasse, 
EMailAdresse, Passwort, RegistrierDatum, Geschlecht, Rolle) VALUES
	(1, 'Volker', 'Baumann', '03502696312', 'Deutsch', 'Deutschland', 'Dresden', '5', 'Schöne Gasse', 
    'volkibau@gmx.com', '$2a$10$vruO0ydK5mruYvOMa6bqIuDdUs7dTR2TIbaizs58XH2XYoZoydVwy', '11.11.2020', 'm', 'Vermieter'),
    (2, 'Odin', 'Augtausch', '00010224680', 'Isländisch', 'Island', 'Heta', '1', 'Hlidsvegur', 
    'vilive@gmail.com','$2a$10$vruO0ydK5mruYvOMa6bqIuDdUs7dTR2TIbaizs58XH2XYoZoydVwy', '13.11.2020', 'm', 'Benutzer');