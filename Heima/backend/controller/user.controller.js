'use strict';

const User = require('../model/user.model');

exports.findById = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	User.findById(id, function(err, user) {
		if (err) return res.status(500).send('Error occured during fetching user for id ' + id);
        console.log('user: ', user);
        
		return res.send(user);
	});
};

exports.create = function(req, res) {
	const newUser = new User(req.body);
	
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		return res.status(400).send('One or more required fields are missing');
	} 
	
	if (!newUser.Sprache || !newUser.Telefonnummer || !newUser.Ort || 
		!newUser.Land || !newUser.Hausnummer || !newUser.Strasse || 
		!newUser.EMailAdresse || !newUser.Passwort || !newUser.Vorname || !newUser.Nachname
		|| !newUser.RegistrierDatum || !newUser.Geschlecht || !newUser.Rolle) {		
		return res.status(400).send('One or more required fields are missing')
	} 
	else {		
		User.create(newUser, function(err, UserID) {
			if (err || UserID <= 0) {
				return res.status(500).send('Error occured during saving profil');
			}

			return res.sendStatus(200);
		});
	}
};

exports.findByEmail = function(req, res) {
	const email = req.body.EMailAdresse
	console.log(req.body)
	// 400 = bad request
	if (!email) {
		return res.status(400).send('Email field is required')
	}
	
	User.findByEmail(email, function(err, user) {
		if (err) {
			return res.status(500).send('Error occured during fetching user for given email ' + 
			email);
		}
		
		console.log('Executed findbyEmail (User)');
		
		return res.send(user);
	});
}