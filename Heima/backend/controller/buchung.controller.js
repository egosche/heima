'use strict';

const Buchung = require('../model/buchung.model');


exports.findById = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Buchung.findById(id, function(err, buchung) {
		if (err) return res.status(500).send('Error occured during fetching buchung for id ' + id);
		console.log('buchung: ', buchung);
		
		return res.send(buchung);
	});
};

exports.findByVermieterId = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Buchung.findByVermieterId(id, function(err, buchung) {
		if (err) return res.status(500).send('Error occured during fetching Buchung for vermieterid ' + id);
		console.log('buchung: ', buchung);
        
        return res.send(buchung);
	});
};

exports.findByBenutzerId = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Buchung.findByBenutzerId(id, function(err, buchung) {
		if (err) return res.status(500).send('Error occured during fetching Buchung for benutzerid ' + id);
		console.log('buchung: ', buchung);
        
        return res.send(buchung);
	});
};

exports.create = function(req, res) {
	const newBuchung = new Buchung(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		return res.status(400).send('One or more required fields are missing');
	} if (!newBuchung.ErstellerIDfk || !newBuchung.ZimmerIDfk || !newBuchung.Status || !newBuchung.Anfang || 
		!newBuchung.Ende || !newBuchung.Buchungszeitpunkt || !newBuchung.PreisproNacht || 
		!newBuchung.Zusatzleistungen) {		
		return res.status(400).send('One or more required fields are missing')
	} else {		
		Buchung.create(newBuchung, function(err, BuchungID) {
			console.log('err: ', err);
			//if (err === Object) res.status(500).send('Zimmer already exist with name ' + err.ZimmerID);
			
			if (err || BuchungID <= 0) return res.status(500).send('Error occured during saving buchung');
			
			return res.sendStatus(200);
		});
	}
};

exports.update = function(req, res) {
	const buchung = new Buchung(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
		return res.status(400).send('One or more required fields are missing');
	} if (!buchung.BuchungID || !buchung.ErstellerIDfk || !buchung.ZimmerIDfk || !buchung.Status || !buchung.Anfang || 
		!buchung.Ende || !buchung.Buchungszeitpunkt || !buchung.PreisproNacht || 
		!buchung.Zusatzleistungen) {	
		return res.status(400).send('One or more required fields are missing');
	} else {
		Buchung.update(buchung, function(err, result) {
			if (err || result <= 0) return res.status(500).send('Error occured during updating buchung');
			
			return res.sendStatus(200);
		});
	}
};

exports.patchStatus = function(req, res) {
	const buchung = new Buchung(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
		return res.status(400).send('One or more required fields are missing');
	} if (!buchung.BuchungID || !buchung.Status) {	
		return res.status(400).send('One or more required fields are missing');
	} else {
		Buchung.patchStatus(buchung, function(err, result) {
			if (err || result <= 0) return res.status(500).send('Error occured during patching status of buchung');
			
			return res.sendStatus(200);
		});
	}
};