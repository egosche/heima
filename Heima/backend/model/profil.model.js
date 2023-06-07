'use strict';
var con = require('../config/db');

// Profil Object

var Profil = function(profil){
    this.ProfilID = profil.ProfilID;
    this.Profilbild = profil.Profilbild;
	this.Freitextbeschreibung = profil.Freitextbeschreibung;
	this.BesitzerIDfk = profil.BesitzerIDfk
};

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

// Define CRUD Operations Functions

Profil.findById = function (id, result) {
	let sql = 'SELECT * FROM profil WHERE ProfilID = ?';
	
	con.query(sql, id, (err, row, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        row = preventLatin(row)
		console.log('Executed findById');
		result(null, row);
	});
};

Profil.findByBesitzerId = function (id, result) {
	let sql = 'SELECT * FROM profil WHERE BesitzerIDfk = ?';
	
	con.query(sql, id, (err, rows, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        rows = preventLatin(rows)
		console.log('Executed findByBesitzerID');
		result(null, rows);
	});
};

Profil.create = function(newProfil, result) {
    let data = [
        newProfil.Profilbild,
        newProfil.Freitextbeschreibung,
        newProfil.BesitzerIDfk
    ];

    let sql = "INSERT INTO profil (\
        Profilbild,\
        Freitextbeschreibung,\
        BesitzerIDfk) VALUES(?, ?, ?)";
    
    let profilID;

    con.query(sql, data, (err, row, fields) => {
        if (err) {
			console.log("error: ", err);
			result(err, null);
        }
        profilID = row.insertId;
    });

    result(null, profilID);
};

Profil.update = function(profil, result){
	let data = [
		profil.Profilbild, 
		profil.Freitextbeschreibung, 
		profil.BesitzerIDfk,
		profil.ProfilID
	];
	
	let sql = 'UPDATE Profil SET \
		Profilbild = ?, \
		Freitextbeschreibung = ?, \
		BesitzerIDfk = ? \
		WHERE ProfilID = ?';

	let profilID
	
	con.query(sql, data, (err, row, fields) => {
		if (err) {
			console.log("Error while setting data: ", err)
			result(err, null)
		}	
		console.log('Executed update')
		profilID = row.affectedRows
	});
	
	result(null, profilID)
};

module.exports = Profil;