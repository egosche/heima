'use strict';
const { param } = require('../route/user.route');
var con = require('./../config/db');

var User = function(user){
    this.UserID = user.UserID;
    this.Vorname = user.Vorname;
    this.Nachname = user.Nachname;
    this.Geschlecht = user.Geschlecht;
    this.EMailAdresse = user.EMailAdresse;
    this.Passwort = user.Passwort;
    this.Strasse = user.Strasse;
    this.Hausnummer = user.Hausnummer;
    this.Land = user.Land;
    this.Ort = user.Ort;
    this.Sprache = user.Sprache;
    this.Telefonnummer = user.Telefonnummer;
    this.Rolle = user.Rolle;
    this.RegistrierDatum = user.RegistrierDatum;
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

User.findById = function (id, result){
    let sql = 'SELECT * FROM user where UserID = ' + id;

    con.query(sql, id, (err, row, fields) => {
        console.log("error: ", err);
        if (err) result(err, null);
        // Workaround to prevent wrong charset
        row = preventLatin(row)
		result(null, row);
	});
}

User.create = function (newUser, result) {	
	let data = [
        newUser.Vorname,
        newUser.Nachname,
        newUser.Geschlecht,
        newUser.EMailAdresse,
        newUser.Passwort,
        newUser.Strasse,
        newUser.Hausnummer,
        newUser.Land,
        newUser.Ort,
        newUser.Sprache,
        newUser.Telefonnummer,
        newUser.Rolle,
        newUser.RegistrierDatum
    ];
    let sql = "INSERT INTO user (\
        Vorname,\
        Nachname,\
        Geschlecht,\
        EMailAdresse,\
        Passwort,\
        Strasse,\
        Hausnummer,\
        Land,\
        Ort,\
        Sprache,\
        Telefonnummer,\
        Rolle,\
        RegistrierDatum) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    let userID;

    con.query(sql, data, (err, row, fields) => {
        if (err) {
			console.log("error: ", err);
			result(err, null);
        }
        
        userID = row.insertId;
    });

    result(null, userID);
};

User.findByEmail = function (email, result) {
	
      let sql = 'SELECT * FROM user WHERE EMailAdresse = ?';

	con.query(sql, email, (err, rows, fields) => {
        console.log("error: ", err);
        console.log(rows)
        if (err) result(err, null);
        // Workaround to prevent wrong charset
        rows = preventLatin(rows)
		result(null, rows);
	});
};


module.exports = User;