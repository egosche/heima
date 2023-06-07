'use strict';

const Zimmer = require('../model/zimmer.model');

function convertZimmerbildToB64(zimmer) {
	for(let i = 0; i < zimmer.length; i++) {
		if (zimmer[i].Bild) {
			zimmer[i].Bild = zimmer[i].Bild.toString('base64');
		}
	}
	return zimmer
}

exports.findById = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Zimmer.findById(id, function(err, zimmer) {
		if (err) return res.status(500).send('Error occured during fetching zimmer for id ' + id);
		console.log('Executed findById (Zimmer)');
		
		//convertZimmerbildToB64(zimmer);
		return res.send(zimmer);
	});
};

exports.findByVermieterId = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Zimmer.findByVermieterId(id, function(err, zimmer) {
		if (err) return res.status(500).send('Error occured during fetching zimmer for vermieterid ' + id);
		console.log('Executed findByVermieterId (Zimmer)');
		
		return res.send(zimmer);
	});
};

exports.findByParams = function(req, res) {
	const params = [req.body.Titel, req.body.Stadt, req.body.Land]
	
	// 400 = bad request
	if (!params) {
		return res.status(400).send('One field at least is required (titel, stadt, land)')
	}
	
	Zimmer.findByParams(params, function(err, zimmer) {
		if (err) {
			return res.status(500).send('Error occured during fetching zimmer for given params ' + params[0] + 
			', ' + params[1] + ' and ' + params[2]);
		}
		
		console.log('Executed findbyParams (Zimmer)');
		convertZimmerbildToB64(zimmer);
		return res.send(zimmer);
	});
};

exports.findAll = function(req, res) {
	Zimmer.findAll(function(err, zimmer) {
		if (err) return res.status(500).send('Error occured during fetching zimmer');
		console.log('Executed findAll (Zimmer)');

		convertZimmerbildToB64(zimmer);
		return res.send(zimmer);
	});
};

exports.create = function(req, res) {
	const newZimmer = new Zimmer(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		return res.status(400).send('One or more required fields are missing');
	} if (!newZimmer.Titel || !newZimmer.Beschreibung || !newZimmer.Ausstattungsangebot || !newZimmer.Verfuegbarkeit || 
		!newZimmer.PreisproNacht || !newZimmer.Zimmerkategorie || !newZimmer.Ort || !newZimmer.Land ||
		!newZimmer.Hausnummer || !newZimmer.Strasse || !newZimmer.Zusatzleistungen || !newZimmer.VermieterIDfk || !newZimmer.Anzahl) {		
		return res.status(400).send('One or more required fields are missing')
	} else {		
		Zimmer.create(newZimmer, function(err, ZimmerID) {
			console.log('err: ', err);
			//if (err === Object) res.status(500).send('Zimmer already exist with name ' + err.ZimmerID);
			
			if (err || ZimmerID <= 0) return res.status(500).send('Error occured during saving zimmer');
			console.log('Executed create (Zimmer)');
			
			return res.sendStatus(200);
		});
	}
};

exports.update = function(req, res) {
	const zimmer = new Zimmer(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
		return res.status(400).send('One or more required fields are missing');
	} if (!zimmer.ZimmerID || !zimmer.Titel || !zimmer.Beschreibung || !zimmer.Ausstattungsangebot || !zimmer.Verfuegbarkeit || 
		!zimmer.PreisproNacht || !zimmer.Zimmerkategorie || !zimmer.Ort || !zimmer.Land ||
		!zimmer.Hausnummer || !zimmer.Strasse || !zimmer.Zusatzleistungen || !zimmer.VermieterIDfk || !zimmer.Anzahl) {
		return res.status(400).send('One or more required fields are missing');
	} else {
		Zimmer.update(zimmer, function(err, result) {
			if (err || result <= 0) return res.status(500).send('Error occured during updating zimmer');
			return res.sendStatus(200);
		});
	}
};

exports.delete = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing');
	}
	
	Zimmer.delete(id, function(err, employee) {
		if (err) return res.status(500).send('Error occured during deleting zimmer');
		return res.sendStatus(200);
	});
};