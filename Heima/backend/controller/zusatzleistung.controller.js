'use strict';

const Zusatzleistung = require('../model/zusatzleistung.model');

exports.findById = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Zusatzleistung.findById(id, function(err, zusatzleistung) {
		if (err) return res.status(500).send('Error occured during fetching Zusatzleistung for id ' + id);
		console.log('zusatzleistung: ', zusatzleistung);
        
        return res.send(zusatzleistung);
	});
};

exports.findByZimmerId = function(req, res) {
	const id = req.params.id;
	
	if (!id) {
		// 400 = bad request
		return res.status(400).send('The required path variable id is missing')
	}
	
	Zusatzleistung.findByZimmerId(id, function(err, zusatzleistung) {
		if (err) return res.status(500).send('Error occured during fetching Zusatzleistung for zimmerid ' + id);
		console.log('zusatzleistung: ', zusatzleistung);
        
        return res.send(zusatzleistung);
	});
};