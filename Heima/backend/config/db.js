'use strict';

const mysql = require('mysql');

var con = mysql.createConnection({
	host: 'heimadb',
	user: 'heimo',
	password: 'Astral',
	database: 'heimadb',
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected to HeimaDB!");
});

module.exports = con;

