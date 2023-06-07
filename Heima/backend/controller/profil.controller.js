'use strict';

const Profil = require('../model/profil.model');

function convertProfilbildToB64(profil) {
	for(let i = 0; i < profil.length; i++) {
		if (profil[i].Profilbild) {
			profil[i].Profilbild = profil[i].Profilbild.toString('base64');
		}
	}
	return profil
}

exports.findById = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Profil.findById(id, function(err, profil) {
		if (err) return res.status(500).send('Error occured during fetching Profil for id ' + id);

		convertProfilbildToB64(profil);
        return res.send(profil);
	});
};

exports.findByBesitzerId = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Profil.findByBesitzerId(id, function(err, profil) {
		if (err) return res.status(500).send('Error occured during fetching Profil for besitzerid ' + id);
		if (profil.length == 0) return res.status(404).send('Requested resource could not be found')
		
		convertProfilbildToB64(profil);
        return res.send(profil);
	});
};

exports.create = function(req, res) {
	const newProfil = new Profil(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		return res.status(400).send('One or more required fields are missing');
	} if (!newProfil.BesitzerIDfk) {	
		return res.status(400).send('One or more required fields are missing')
	} else {		
		Profil.create(newProfil, function(err, ProfilID) {
			console.log('err: ', err);
			//if (err === Object) res.status(500).send('Zimmer already exist with name ' + err.ZimmerID);
			
			if (err || ProfilID <= 0) return res.status(500).send('Error occured during saving profil');
			
			return res.sendStatus(200);
		});
	}
};

exports.update = function(req, res) {
	const profil = new Profil(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
		return res.status(400).send('One or more required fields are missing');
	} if (!profil.ProfilID || !profil.Profilbild || !profil.Freitextbeschreibung || !profil.BesitzerIDfk) {
		return res.status(400).send('One or more required fields are missing');
	} else {
		Profil.update(profil, function(err, result) {
			if (err || result <= 0) return res.status(500).send('Error occured during updating profil');
			
			return res.sendStatus(200);
		});
	}
};