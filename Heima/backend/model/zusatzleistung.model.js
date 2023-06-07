'use strict';
var con = require('./../config/db');

// Zusatzleistung Object

var Zusatzleistung = function(zusatzleistung){
    this.ZusatzleistungID = zusatzleistung.ZusatzleistungID;
    this.Bezeichnung = zusatzleistung.Bezeichnung;
    this.ZimmerIDfk = zusatzleistung.ZimmerIDfk;
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

Zusatzleistung.findById = function (id, result) {
	let sql = 'SELECT * FROM zusatzleistung WHERE ZusatzleistungID = ?';
	
	con.query(sql, id, (err, row, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        row = preventLatin(row)
		console.log(row);
		result(null, row);
	});
};

Zusatzleistung.findByZimmerId = function (id, result) {
	let sql = 'SELECT l.ZimmerIDfk AS ZimmerID, group_concat(ZusatzleistungID separator \',\') AS ZusatzleistungID, \
		group_concat(Bezeichnung separator \',\') AS Zusatzleistungen \
	FROM zusatzleistung AS z \
		INNER JOIN zusatzleistung_zimmer AS l ON z.ZusatzleistungID = ZusatzleistungIDfk \
	WHERE ZimmerIDfk = ? \
	GROUP BY l.ZimmerIDfk';
	
	con.query(sql, id, (err, rows, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        rows = preventLatin(rows)
		console.log(rows);
		result(null, rows);
	});
};

module.exports = Zusatzleistung;