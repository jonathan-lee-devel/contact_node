'use strict';

// Set up Express Application
const express = require('express');
const app = express();
app.use(express.urlencoded());
const HOST = 'jonathanlee.io';
const PORT = 8080;

// Configure and Connect MongoDB as well as E-mail notifier
const secrets = require('/var/node/secrets.js');
const Contact = require('./Contact.js');

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: secrets.g_user,
		pass: secrets.g_pass
	}
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + secrets.m_user + ":" + secrets.m_pass + "@jdevelmongocluster-ta6vm.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } );
var collection;

client.connect(err => {
	collection = client.db("jonathanlee_io").collection("contacts");

	app.listen(PORT, () => {
		console.log('Running on http://' + HOST + ':' + PORT);
	});

});


// POST Handler
app.post('/submit_contact', (req, res) => {
        const firstname = req.body.firstname;
	const surname = req.body.surname;
        const email = req.body.email;
	const phone = req.body.phone;
        const message = req.body.message;

	var contact = new Contact(firstname, surname, email, phone, message);		
	try {
		collection.insertOne( contact );
	} catch (e) {
		console.log(e);
	};

	console.log('Saved to database:-' + new Date());

	var subjectString = 'Contact <' + email + '> Submitted on jonathanlee.io';
	var textString = 'First Name: ' + firstname + '\nSurname: ' + surname + '\nE-mail: ' + email + '\nPhone: ' + phone + '\nMessage: ' + message;

	var mailOptions = {
        	from: secrets.g_user,
	        to: secrets.target_email,
	        subject: subjectString,
	        text: textString
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error) {
			console.log(error);
		} else {
			console.log('E-mail sent' + info.response);
		}
	});


        res.end();
});

