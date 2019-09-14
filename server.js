'use strict';

// Set up Express Application
const express = require('express');
const app = express();
app.use(express.urlencoded());
const HOST = 'jonathanlee.io';
const PORT = 8080;

const Contact = require('./Contact.js');

// Configure and Connect MongoDB
const secrets = require('./secrets');

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
	
        console.log('Received: ' + firstname + surname + email + phone + message);

        res.end();
});

