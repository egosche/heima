'use strict';
let con = require('../config/db');

// Objekt Bewertung

let Bewertung = function(bewertung){
    this.BewertungID = bewertung.BewertungID;
    this.AnzahlSterne = bewertung.AnzahlSterne;
    this.BewertungsZeitpunkt = bewertung.BewertungsZeitpunkt;
    this.ZimmerIDfk = bewertung.ZimmerIDfk;
    this.ErstellerIDfk = bewertung.ErstellerIDfk;
    this.BesitzerIDfk = bewertung.BesitzerIDfk;
    this.BuchungIDfk = bewertung.BuchungIDfk;
}

function preventLatin(rows) {
    Object.keys(rows).forEach(function(key) {
        var zeile = rows[key];
        for (var key in zeile) {
            if (zeile.hasOwnProperty(key)) {
                try {
                    if (zeile[key].includes("Ã¤") || zeile[key].includes("Ã¶") ||  
                        zeile[key].includes("Ã¼") || zeile[key].includes("") ||
                        zeile[key].includes("ÃŸ")) {
                            zeile[key] = decodeURIComponent(escape(zeile[key]));
                        }
                } catch (error) {
                    console.log("Warning: URI malformed. Skip.")
                }
            }
        }
    });
    return rows
}

//CRUD Operations

//alle Bewertungen des Zimmers sollen gefunden werden
Bewertung.findById = function(id, result) {
    let sql = "SELECT BewertungID, AnzahlSterne, BewertungsZeitpunkt, \
    ZimmerIDfk, ErstellerIDfk, BesitzerIDfk, BuchungIDfk FROM bewertung  \
    WHERE ZimmerIDfk = ? GROUP BY BewertungID";

    con.query(sql, id, (err, rows, fields) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
        }
        // Workaround to prevent wrong charset
        rows = preventLatin(rows)
		console.log(rows);
		result(null, rows);
	});
};

//alle Bewertungen nach BuchungID sollen gefunden werden
Bewertung.findByBuchungId = function(id, result) {
    let sql = "SELECT BewertungID, AnzahlSterne, BewertungsZeitpunkt, \
    ZimmerIDfk, ErstellerIDfk, BesitzerIDfk, BuchungIDfk FROM bewertung  \
    WHERE BuchungIDfk = ? GROUP BY BewertungID";

    con.query(sql, id, (err, rows, fields) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
        }
        // Workaround to prevent wrong charset
        rows = preventLatin(rows)
		console.log(rows);
		result(null, rows);
	});
};

Bewertung.findAll = function (result) {
	let sql = "SELECT BewertungID, AnzahlSterne, BewertungsZeitpunkt, \
    ZimmerIDfk, ErstellerIDfk, BesitzerIDfk, BuchungIDfk FROM bewertung  \
    GROUP BY BewertungID";
	
	con.query(sql, (err, rows, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
        // Workaround to prevent wrong charset
        rows = preventLatin(rows)
		console.log(rows);
		result(null, rows);
	});
};


Bewertung.create = function(newBewertung, res) {
    let data = [
       // newBewertung.BewertungID,
        newBewertung.AnzahlSterne,
        newBewertung.BewertungsZeitpunkt,
        newBewertung.ZimmerIDfk,
        newBewertung.ErstellerIDfk,
        newBewertung.BesitzerIDfk,
        newBewertung.BuchungIDfk,
    ];

    let sql = "INSERT INTO bewertung (\
        AnzahlSterne,\
        BewertungsZeitpunkt,\
        ZimmerIDfk,\
        ErstellerIDfk,\
        BesitzerIDfk,\
        BuchungIDfk) VALUES(?, ?, ?, ?, ?, ?)";
    
    let bewertungID;

    con.query(sql, data, (err, row, fields) => {
        if (err) {
			console.log("error: ", err);
			result(err, null);
        }
        
        bewertungID = row.insertId;
    });

    //result(null, bewertungID);
};
module.exports = Bewertung;