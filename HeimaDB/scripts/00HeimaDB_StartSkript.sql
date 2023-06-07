CREATE DATABASE IF NOT EXISTS heimadb;


CREATE TABLE IF NOT EXISTS `heimadb`.`user` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `Sprache` VARCHAR(50) NULL,
  `Telefonnummer` VARCHAR(45) NULL,
  `Ort` VARCHAR(85) NULL,
  `Land` VARCHAR(80) NULL,
  `Hausnummer` VARCHAR(45) NULL,
  `Strasse` VARCHAR(60) NULL,
  `EMailAdresse` VARCHAR(45) NULL,
  `Passwort` VARCHAR(500) NULL,
  `Vorname` VARCHAR(45) NULL,
  `Nachname` VARCHAR(45) NULL,
  `RegistrierDatum` DATETIME NULL,
  `Geschlecht` ENUM('m', 'w', 'd') NULL,
  `Rolle` ENUM('Vermieter', 'Benutzer') NOT NULL,
  PRIMARY KEY (`UserID`));
  
  CREATE TABLE IF NOT EXISTS `heimadb`.`zusatzleistung` (
  `ZusatzleistungID` INT NOT NULL AUTO_INCREMENT,
  `Bezeichnung` VARCHAR(60) NULL,
  PRIMARY KEY (`ZusatzleistungID`));


CREATE TABLE IF NOT EXISTS `heimadb`.`zimmer` (
  `ZimmerID` INT NOT NULL AUTO_INCREMENT,
  `Titel` VARCHAR(100) NULL,
  `Beschreibung` VARCHAR(300) NULL,
  `Ausstattungsangebot` VARCHAR(200) NULL,
  `Verfuegbarkeit` ENUM('frei', 'belegt') NOT NULL,
  `PreisproNacht` DECIMAL(8,2) NULL,
  `Zimmerkategorie` VARCHAR(25) NULL,
  `Bild` MEDIUMTEXT NULL,
  `Ort` VARCHAR(85) NULL,
  `Land` VARCHAR(80) NULL,
  `Hausnummer` VARCHAR(45) NULL,
  `Strasse` VARCHAR(45) NULL,
  `Anzahl` INT NOT NULL,
  `VermieterIDfk` INT NOT NULL,
  PRIMARY KEY (`ZimmerID`),
  CONSTRAINT `VermieterIDfk` 
	FOREIGN KEY (`VermieterIDfk`) REFERENCES `heimadb`.`user` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION);
    
    
CREATE TABLE IF NOT EXISTS `heimadb`.`zusatzleistung_zimmer` (
  `ZusatzleistungZimmerID` INT NOT NULL AUTO_INCREMENT,
  `ZusatzleistungIDfk` INT NULL,
  `ZimmerIDfk` INT NULL,
  PRIMARY KEY (`ZusatzleistungZimmerID`),
   CONSTRAINT `ZusatzleistungIDfkzimmer` 
	FOREIGN KEY (`ZusatzleistungIDfk`) REFERENCES `heimadb`.`zusatzleistung` (`ZusatzleistungID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ZusatzleistungIDZimmerfk`
    FOREIGN KEY (`ZimmerIDfk`) REFERENCES `heimadb`.`zimmer` (`ZimmerID`) ON DELETE NO ACTION ON UPDATE NO ACTION);
    
CREATE TABLE IF NOT EXISTS `heimadb`.`buchung` (
  `BuchungID` INT NOT NULL AUTO_INCREMENT,
  `ErstellerIDfk` INT NOT NULL,
  `ZimmerIDfk` INT NOT NULL,
  `Status` ENUM('ausstehend', 'akzeptiert', 'abgelehnt', 'vom Nutzer storniert') NULL,
  `Anfang` DATETIME NULL,
  `Ende` DATETIME NULL,
  `Buchungszeitpunkt` DATETIME NULL,
  `PreisproNacht` DECIMAL(8,2) NULL,
  PRIMARY KEY (`BuchungID`),
  CONSTRAINT `ZimmerIDfk`
    FOREIGN KEY (`ZimmerIDfk`) REFERENCES `heimadb`.`zimmer` (`ZimmerID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ErstellerIDBuchungfk`
    FOREIGN KEY (`ErstellerIDfk`) REFERENCES `heimadb`.`user` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `heimadb`.`bewertung` (
  `BewertungID` INT NOT NULL AUTO_INCREMENT,
  `BuchungIDfk` INT NULL,
  `AnzahlSterne` ENUM('1', '2', '3', '4', '5') NULL,
  `BewertungsZeitpunkt` DATETIME NULL,
  `ZimmerIDfk` INT NULL,
  `ErstellerIDfk` INT NOT NULL,
  `BesitzerIDfk` INT NULL,
  PRIMARY KEY (`BewertungID`),
  CONSTRAINT `ZimmerIDBewertungfk`
    FOREIGN KEY (`ZimmerIDfk`) REFERENCES `heimadb`.`zimmer` (`ZimmerID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ErstellerIDfk`
    FOREIGN KEY (`ErstellerIDfk`) REFERENCES `heimadb`.`user` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `BesitzerIDfk`
    FOREIGN KEY (`BesitzerIDfk`) REFERENCES `heimadb`.`user` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `BuchungIDfk`
    FOREIGN KEY (`BuchungIDfk`) REFERENCES `heimadb`.`buchung` (`BuchungID`) ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `heimadb`.`zusatzleistung_buchung` (
  `ZusatzleistungBuchungID` INT NOT NULL AUTO_INCREMENT,
  `ZusatzleistungIDfk` INT NULL,
  `BuchungIDfk` INT NULL,
  PRIMARY KEY (`ZusatzleistungBuchungID`),
   CONSTRAINT `ZusatzleistungIDBuchungfk` 
	FOREIGN KEY (`BuchungIDfk`) REFERENCES `heimadb`.`buchung` (`BuchungID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ZusatzleistungIDfkbuchung`
    FOREIGN KEY (`ZusatzleistungIDfk`) REFERENCES `heimadb`.`zusatzleistung` (`ZusatzleistungID`) ON DELETE NO ACTION ON UPDATE NO ACTION);
    
    
CREATE TABLE IF NOT EXISTS `heimadb`.`profil` (
  `ProfilID` INT NOT NULL AUTO_INCREMENT,
  `Profilbild` MEDIUMTEXT NULL,
  `Freitextbeschreibung` TEXT NULL,
  `BesitzerIDfk` INT NOT NULL,
  PRIMARY KEY (`ProfilID`),
  CONSTRAINT `BesitzerIDProfilfk` 
	FOREIGN KEY (`BesitzerIDfk`) REFERENCES `heimadb`.`user` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION);