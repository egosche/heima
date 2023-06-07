'use strict';
var con = require('./../config/db');

// Buchung Object

var Buchung = function(buchung){
    this.BuchungID = buchung.BuchungID;
    this.ErstellerIDfk = buchung.ErstellerIDfk;
	this.ZimmerIDfk = buchung.ZimmerIDfk;
	this.Status = buchung.Status;
	this.Anfang = buchung.Anfang;
	this.Ende = buchung.Ende;
	this.Buchungszeitpunkt = buchung.Buchungszeitpunkt;
	this.PreisproNacht = buchung.PreisproNacht;
	this.Zusatzleistungen = buchung.Zusatzleistungen;
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

Buchung.findById = function (id, result) {
	let sql = 'SELECT b.BuchungID, b.ErstellerIDfk, k.VermieterIDfk, b.ZimmerIDfk, b.Status, b.Anfang, b.Ende, b.Buchungszeitpunkt, \
	b.PreisproNacht, group_concat(ZusatzleistungID separator \',\') AS ZusatzleistungID,  group_concat(Bezeichnung separator \',\') \
	AS Zusatzleistungen \
	FROM buchung AS b \
		INNER JOIN zusatzleistung_buchung AS l ON l.BuchungIDfk = b.BuchungID \
		INNER JOIN zusatzleistung AS z ON z.ZusatzleistungID = l.ZusatzleistungIDfk \
		INNER JOIN zimmer AS k ON k.ZimmerID = b.ZimmerIDfk \
		INNER JOIN user as u ON u.UserID = k.VermieterIDfk \
	WHERE b.BuchungID = ? \
	GROUP BY b.BuchungID';
	
	con.query(sql, id, (err, row, fields) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
		}
		// Workaround to prevent wrong charset
        row = preventLatin(row)
		console.log(row);
		result(null, row);
	});
};

Buchung.findByVermieterId = function (id, result) {
	let sql = 'SELECT b.BuchungID, b.ErstellerIDfk, b.ZimmerIDfk, b.Status, b.Anfang, b.Ende, b.Buchungszeitpunkt, b.PreisproNacht, \
	group_concat(ZusatzleistungID separator \',\') AS ZusatzleistungID,  group_concat(Bezeichnung separator \',\') AS Zusatzleistungen \
	FROM buchung AS b \
		INNER JOIN zusatzleistung_buchung AS l ON l.BuchungIDfk = b.BuchungID \
		INNER JOIN zusatzleistung AS z ON z.ZusatzleistungID = l.ZusatzleistungIDfk \
		INNER JOIN zimmer AS k ON k.ZimmerID = b.ZimmerIDfk \
		INNER JOIN user as u ON u.UserID = k.VermieterIDfk \
	WHERE u.UserID = ? \
	GROUP BY b.BuchungID';
	
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

Buchung.findByBenutzerId = function (id, result) {
	let sql = 'SELECT b.BuchungID, k.VermieterIDfk, b.ZimmerIDfk, b.Status, b.Anfang, b.Ende, b.Buchungszeitpunkt, b.PreisproNacht, \
	group_concat(ZusatzleistungID separator \',\') AS ZusatzleistungID,  group_concat(Bezeichnung separator \',\') AS Zusatzleistungen \
	FROM buchung AS b \
		INNER JOIN zusatzleistung_buchung AS l ON l.BuchungIDfk = b.BuchungID \
		INNER JOIN zusatzleistung AS z ON z.ZusatzleistungID = l.ZusatzleistungIDfk \
		INNER JOIN zimmer AS k ON k.ZimmerID = b.ZimmerIDfk \
		INNER JOIN user as u ON u.UserID = k.VermieterIDfk \
	WHERE b.ErstellerIDfk = ? \
	GROUP BY b.BuchungID';
	
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

Buchung.create = function (newBuchung, result) {	
	let data = [
		newBuchung.ErstellerIDfk, 
		newBuchung.ZimmerIDfk,
		newBuchung.Status,
		newBuchung.Anfang,
		newBuchung.Ende,
		newBuchung.Buchungszeitpunkt,
		newBuchung.PreisproNacht,
	];

	let zusatzleistungen = newBuchung.Zusatzleistungen.split(',');
	
	let sqlbuchung = 'INSERT INTO buchung( \
		ErstellerIDfk, \
		ZimmerIDfk, \
		Status, \
		Anfang, \
		Ende, \
		Buchungszeitpunkt, \
		PreisproNacht) \
		VALUES(?, ?, ?, ?, ?, ?, ?)';

	var buchungid, zusatzleistungid

	con.query(sqlbuchung, data, (err, row, fields) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
		}
		
		console.log('BuchungID ' + row.insertId);
		buchungid = row.insertId;
	});

	for (let i = 0; i < zusatzleistungen.length; i++) {
		con.query('SELECT ZusatzleistungID FROM zusatzleistung WHERE Bezeichnung = ?', zusatzleistungen[i], (err, row, fields) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
			}
			
			if (Object.keys(row).length) {
				console.log('ZusatzleistungID: ' + row[0].ZusatzleistungID);
				con.query('INSERT INTO zusatzleistung_buchung(ZusatzleistungIDfk, BuchungIDfk) VALUES (?, ?)', 
					[row[0].ZusatzleistungID, buchungid], (err, row, fields) => {
						if (err) {
							console.log("error: ", err);
							result(err, null);
						}
					console.log('ZusatzleistungBuchungID: ' + row.insertId);
				});
			}
			else {
				console.log(zusatzleistungen[i] + 'Zusatzleistung ist nicht vorhanden.')
				con.query('INSERT INTO zusatzleistung(Bezeichnung) VALUES (?)', zusatzleistungen[i], (err, row, fields) => {
					console.log("error: ", err);
					if (err) result(err, null);
					zusatzleistungid = row.insertId;
					console.log('ZusatzleistungID: ' + row.insertId);

					con.query('INSERT INTO zusatzleistung_buchung(ZusatzleistungIDfk, BuchungIDfk) VALUES (?, ?)', 
					[zusatzleistungid, buchungid], (err, row, fields) => {
						if (err) {
							console.log("error: ", err);
							result(err, null);
						}
						console.log('ZusatzleistungBuchungID: ' + row.insertId);
					});
				});	
			}
		});
	}
	result(null, buchungid);
};

Buchung.update = function(buchung, result){
	let data = [
		buchung.ErstellerIDfk, 
		buchung.ZimmerIDfk,
		buchung.Status,
		buchung.Anfang,
		buchung.Ende,
		buchung.Buchungszeitpunkt,
		buchung.PreisproNacht,
		buchung.BuchungID
	];

	let zusatzleistungen = buchung.Zusatzleistungen.split(',');
	
	let sql = 'UPDATE buchung SET \
		ErstellerIDfk = ?, \
		ZimmerIDfk = ?, \
		Status = ?, \
		Anfang = ?, \
		Ende = ?, \
		Buchungszeitpunkt = ?, \
		PreisproNacht = ? \
		WHERE BuchungID = ?';

	var buchungid, zusatzleistungid
	
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
				con.query('UPDATE zusatzleistung_buchung SET ZusatzleistungIDfk = ? WHERE BuchungIDfk = ?', 
					[row[0].ZusatzleistungID, data.BuchungID], (err, row, fields) => {
						if (err) {
							console.log("Error while updating table zusatzleistung_buchung: ", err);
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

					con.query('UPDATE zusatzleistung_buchung SET ZusatzleistungIDfk = ? WHERE BuchungIDfk = ?)', 
						[zusatzleistungid, data.BuchungID], (err, row, fields) => {
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
	result(null, buchungid);
};

Buchung.patchStatus = function(buchung, result){
	let data = [
		buchung.Status,
		buchung.BuchungID
	];
	
	let sql = 'UPDATE buchung SET Status = ? WHERE BuchungID = ?';
	
	con.query(sql, data, (err, row, fields) => {
		if (err) {
			console.log("Error while setting data: ", err);
			result(err, null);
		}	
		console.log('BuchungID ' + row.affectedRows + ' patched successfully!');
		result(null, row.affectedRows);
	});
};


module.exports = Buchung;