'use strict';
const Bewertung = require('../model/bewertung.model');


exports.findById = function(req, res) {
    const id = req.params.id;

    if(!id) {
        return res.status(400).send('The required path variable id is missing!')
    }

    Bewertung.findById(id, function(err, bewertung){
        if(err) return res.status(500).send("Error occured during fetching id for bewertung " + id);
        
        return res.send(bewertung);
    });
};

exports.findByBuchungId = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Buchung.findByBuchungId(id, function(err, bewertung) {
		if (err) return res.status(500).send('Error occured during fetching Buchung for vermieterid ' + id);
		console.log('bewertung: ', bewertung);
        
        return res.send(bewertung);
	});
};

exports.findAll = function(req, res) {
	Bewertung.findAll(function(err, bewertung) {
		if (err) return res.status(500).send('Error occured during fetching bewertung');
		console.log('bewertung: ', bewertung);

		
		return res.send(bewertung);
	});
};

exports.create = function(req, res) {
    const newBewertung = new Bewertung(req.body);

    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        return res.status(400).send('One or more required fields are missing');
    }
    
    if(!newBewertung.AnzahlSterne || !newBewertung.BewertungsZeitpunkt || !newBewertung.ZimmerIDfk ||
        !newBewertung.ErstellerIDfk || !newBewertung.BesitzerIDfk || !newBewertung.BuchungIDfk) {
            return res.status(400).send('One or more required fields are missing');
    } else {
        Bewertung.create(newBewertung, function(err, BewertungID) {
            if(err || BewertungID <= 0) {
                return res.status(500).send('Error occured during saving bewertung');
            }
            return res.sendStatus(200);
        });
    }
};

exports.update = function(req, res) {
    const bewertung = new Bewertung(req.body);

    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
		return res.status(400).send('One or more required fields are missing');
    } if(!newBewertung.BewertungID || !newBewertung.AnzahlSterne || !newBewertung.BewertungsZeitpunkt || 
        !newBewertung.ZimmerIDfk || !newBewertung.ErstellerIDfk || !newBewertung.BesitzerIDfk || !newBewertung.BuchungIDfk) {	
		return res.status(400).send('One or more required fields are missing');
	} else {
		Bewertung.update(bewertung, function(err, result) {
			if (err || result <= 0) return res.status(500).send('Error occured during updating bewertung');
			
			return res.sendStatus(200);
		});
	}

}