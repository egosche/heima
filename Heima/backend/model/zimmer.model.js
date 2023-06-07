'use strict';
var con = require('./../config/db');

// Zimmer Object

var Zimmer = function(zimmer){
  this.ZimmerID = zimmer.ZimmerID;
  this.Titel = zimmer.Titel;
  this.Beschreibung = zimmer.Beschreibung;
  this.Verfuegbarkeit = zimmer.Verfuegbarkeit;
  this.PreisproNacht = zimmer.PreisproNacht;
  this.Zimmerkategorie = zimmer.Zimmerkategorie;
  this.Bild = zimmer.Bild;
  this.Ort = zimmer.Ort;
  this.Land = zimmer.Land;
  this.Strasse = zimmer.Strasse;
  this.Hausnummer = zimmer.Hausnummer;
  this.Zusatzleistungen = zimmer.Zusatzleistungen;
  this.Ausstattungsangebot = zimmer.Ausstattungsangebot;
  this.VermieterIDfk = zimmer.VermieterIDfk;
  this.Anzahl = zimmer.Anzahl;
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

Zimmer.findById = function (id, result) {
	let sql = 'SELECT ZimmerID, Titel, Beschreibung, Ausstattungsangebot, Verfuegbarkeit, PreisproNacht, Zimmerkategorie, Bild, Ort, \
		Land, Hausnummer, Strasse, Anzahl, VermieterIDfk, group_concat(Bezeichnung separator \',\') AS Zusatzleistungen FROM \
		zusatzleistung_zimmer AS l INNER JOIN zusatzleistung AS z ON z.ZusatzleistungID = l.ZusatzleistungIDfk \
		INNER JOIN zimmer AS i ON i.ZimmerID = l.ZimmerIDfk WHERE ZimmerIDfk = ? GROUP BY ZimmerID';
	
	con.query(sql, id, (err, row, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        row = preventLatin(row)
		console.log('Affected ZimmerID: ' + row.ZimmerID);
		result(null, row);
	});
};

Zimmer.findByVermieterId = function (id, result) {
	let sql = 'SELECT ZimmerID, Titel, Beschreibung, Ausstattungsangebot, Verfuegbarkeit, PreisproNacht, Zimmerkategorie, Bild, Ort, \
		Land, Hausnummer, Strasse, Anzahl, VermieterIDfk, group_concat(Bezeichnung separator \',\') AS Zusatzleistungen FROM \
		zusatzleistung_zimmer AS l INNER JOIN zusatzleistung AS z ON z.ZusatzleistungID = l.ZusatzleistungIDfk \
		INNER JOIN zimmer AS i ON i.ZimmerID = l.ZimmerIDfk WHERE VermieterIDfk = ? GROUP BY ZimmerID';
	
	con.query(sql, id, (err, row, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        row = preventLatin(row)
		console.log('Affected ZimmerID: ' + row.ZimmerID);
		result(null, row);
	});
};

Zimmer.findByParams = function (params, result) {
	var conditions = buildConditions(params);
  	var sql = 'SELECT * FROM zimmer WHERE ' + conditions.where;

	con.query(sql, conditions.values, (err, rows, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        rows = preventLatin(rows)
		console.log('Affected ZimmerID: more than one');
		result(null, rows);
	});
};

Zimmer.findAll = function (result) {
	let sql = 'SELECT ZimmerID, Titel, Beschreibung, Ausstattungsangebot, Verfuegbarkeit, PreisproNacht, Zimmerkategorie, Bild, Ort, \
	Land, Hausnummer, Strasse, Anzahl, VermieterIDfk, group_concat(Bezeichnung separator \',\') AS Zusatzleistungen FROM \
	zusatzleistung_zimmer AS l INNER JOIN zusatzleistung AS z ON z.ZusatzleistungID = l.ZusatzleistungIDfk \
	INNER JOIN zimmer AS i ON i.ZimmerID = l.ZimmerIDfk GROUP BY ZimmerID';
	
	con.query(sql, (err, rows, fields) => {
		console.log("error: ", err);
		if (err) result(err, null);
		// Workaround to prevent wrong charset
        rows = preventLatin(rows)
		result(null, rows);
	});
};

Zimmer.create = function (newZimmer, result) {	
	let data = [
		newZimmer.Titel, 
		newZimmer.Beschreibung, 
		newZimmer.Ausstattungsangebot,
		newZimmer.Verfuegbarkeit,
		newZimmer.PreisproNacht,
		newZimmer.Zimmerkategorie,
		newZimmer.Bild,
		newZimmer.Ort,
		newZimmer.Land,
		newZimmer.Strasse,
		newZimmer.Hausnummer,
		newZimmer.VermieterIDfk, 
		newZimmer.Anzahl
	];

	let zusatzleistungen = newZimmer.Zusatzleistungen.split(',');
	
	let sql = 'INSERT INTO zimmer( \
		Titel, \
		Beschreibung, \
		Ausstattungsangebot, \
		Verfuegbarkeit, \
		PreisproNacht, \
		Zimmerkategorie, \
		Bild, \
		Ort, \
		Land, \
		Strasse, \
		Hausnummer, \
		VermieterIDfk, \
		Anzahl) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	
		var zimmerid, zusatzleistungid
	
	con.query(sql, data, (err, row, fields) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
		}
				
		console.log('New ZimmerID: ' + row.insertId);
		zimmerid = row.insertId;
	});

	for (let i = 0; i < zusatzleistungen.length; i++) {
		con.query('SELECT ZusatzleistungID FROM zusatzleistung WHERE Bezeichnung = ?', zusatzleistungen[i], (err, row, fields) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
			}
			
			if (Object.keys(row).length) {
				console.log('ZusatzleistungID: ' + row[0].ZusatzleistungID);
				con.query('INSERT INTO zusatzleistung_zimmer(ZusatzleistungIDfk, ZimmerIDfk) VALUES (?, ?)', 
					[row[0].ZusatzleistungID, zimmerid], (err, row, fields) => {
					if (err) {
						console.log("error: ", err);
						result(err, null);
					}
					console.log('ZusatzleistungZimmerID: ' + row.insertId);
				});
			}
			else {
				console.log(zusatzleistungen[i] + 'Zusatzleistung ist nicht vorhanden.')
				con.query('INSERT INTO zusatzleistung(Bezeichnung) VALUES (?)', zusatzleistungen[i], (err, row, fields) => {
					if (err) {
						console.log("error: ", err);
						result(err, null);
					}
					zusatzleistungid = row.insertId;
					console.log('ZusatzleistungID: ' + row.insertId);

					con.query('INSERT INTO zusatzleistung_zimmer(ZusatzleistungIDfk, ZimmerIDfk) VALUES (?, ?)', 
					[zusatzleistungid, zimmerid], (err, row, fields) => {
						if (err) {
							console.log("error: ", err);
							result(err, null);
						}
						console.log('ZusatzleistungZimmerID: ' + row.insertId);
					});
				});
			}
		});
	}
	result(null, zimmerid);

};

Zimmer.update = function(zimmer, result){
	let data = [
		zimmer.Titel, 
		zimmer.Beschreibung, 
		zimmer.Ausstattungsangebot,
		zimmer.Verfuegbarkeit,
		zimmer.PreisproNacht,
		zimmer.Zimmerkategorie,
		zimmer.Bild,
		zimmer.Ort,
		zimmer.Land,
		zimmer.Strasse,
		zimmer.Hausnummer,
		zimmer.VermieterIDfk, 
		zimmer.Anzahl,
		zimmer.ZimmerID
	];

	let zusatzleistungen = zimmer.Zusatzleistungen.split(',');
	
	let sql = 'UPDATE zimmer SET \
		Titel = ?, \
		Beschreibung = ?, \
		Ausstattungsangebot = ?, \
		Verfuegbarkeit = ?, \
		PreisproNacht = ?, \
		Zimmerkategorie = ?, \
		Bild = ?, \
		Ort = ?, \
		Land = ?, \
		Strasse = ?, \
		Hausnummer = ?, \
		VermieterIDfk = ?, \
		Anzahl = ? WHERE ZimmerID = ?';

	var zimmerid, zusatzleistungid
	
	con.query(sql, data, (err, row, fields) => {
		if (err) {
			console.log("Error while setting data: ", err);
			result(err, null);
		}	
		console.log(row.affectedRows);
	});

	for (let i = 0; i < zusatzleistungen.length; i++) {
		con.query('SELECT ZusatzleistungID FROM zusatzleistung WHERE Bezeichnung = ?', zusatzleistungen[i], (err, row, fields) => {
			if (err) {
				console.log("Error while selecting Zusatzleistung(en): ", err);
				result(err, null);
			}

			if (Object.keys(row).length) {
				console.log('ZusatzleistungID: ' + row[0].ZusatzleistungID);
				con.query('UPDATE zusatzleistung_zimmer SET ZusatzleistungIDfk = ? WHERE ZimmerIDfk = ?', 
					[row[0].ZusatzleistungID, data[13]], (err, row, fields) => {
						if (err) {
							console.log("Error while updating table zusatzleistung_zimmer: ", err);
							result(err, null);
						}
					
						console.log('Zusatzleistung(en) updated successfully!');
					});
			}
			else {
				console.log(zusatzleistungen[i] + 'Zusatzleistung ist nicht vorhanden.')
				con.query('INSERT INTO zusatzleistung(Bezeichnung) VALUES (?)', zusatzleistungen[i], (err, row, fields) => {
					if (err) {
						console.log("Error while inserting Zusatzleistung(en): ", err);
						result(err, null);
					}
					zusatzleistungid = row.insertId;
					console.log('ZusatzleistungID: ' + row.insertId);

					con.query('UPDATE zusatzleistung_zimmer SET ZusatzleistungIDfk = ? WHERE ZimmerIDfk = ?', 
						[zusatzleistungid, data[13]], (err, row, fields) => {
							if (err) {
								console.log("error: ", err);
								result(err, null);
							}
						console.log('Zusatzleistung(en) updated successfully!');
					});
				});	
			}
		});
	}
	result(null, zimmerid);
};

Zimmer.delete = function(id, result){
	let sql1 = 'DELETE FROM zusatzleistung_zimmer WHERE ZimmerIDfk = ?';
	let sql2 = 'DELETE FROM zimmer WHERE ZimmerID = ?';
	
	con.query(sql1, id, (err, row, fields) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
		}
		console.log(row.affectedRows);
	});

	con.query(sql2, id, (err, row, fields) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
		}
		console.log(row.affectedRows);
		result(null, row.affectedRows);
	});
};

function buildConditions(params) {
	var conditions = [];
	var values = [];
  
	if (typeof params[0] !== 'undefined') {
	  conditions.push("Titel LIKE ?");
	  values.push("%" + params[0] + "%");
	}
  
	if (typeof params[1] !== 'undefined') {
		conditions.push("Ort LIKE ?");
		values.push("%" + params[1] + "%");
	}

	if (typeof params[2] !== 'undefined') {
		conditions.push("Land LIKE ?");
		values.push("%" + params[2] + "%");
	}

	return {
	  where: conditions.length ?
			   conditions.join(' AND ') : '1',
	  values: values
	};
  }

module.exports = Zimmer;