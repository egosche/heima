'use strict';
const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'real_heima@yahoo.com',
      pass: 'bywfzzlzpvfzqwpq'
    }
  });

exports.create = function(req, res) {
	// 400 = bad request
	if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
		return res.status(400).send('One or more required fields are missing');
  } 
  if (!req.body.from || !req.body.to || !req.body.subject || !req.body.text) {		
		return res.status(400).send('One or more required fields are missing')
	} else {		
        transporter.sendMail(req.body, function(error, info){
            if (error) {
                console.log("send Mail: "+ error);
                return res.status(500).send('Error occured during sending email');
            } else {
                console.log('Email sent');
            }
        });

        return res.sendStatus(200);
	}
};