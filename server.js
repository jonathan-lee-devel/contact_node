'use strict';

const express = require('express');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(express.urlencoded());

app.post('/submit_contact', (req, res) => {
        const firstname = req.body.firstname;
        const surname = req.body.surname;
        const email = req.body.email;
        const phone = req.body.phone;
        const message = req.body.message;

	console.log('Received: ' + firstname + surname + email + phone + message);

        res.end();
});

app.listen(PORT, HOST);
console.log('Running on http://${HOST}:${PORT}');
