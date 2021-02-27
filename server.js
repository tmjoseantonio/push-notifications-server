require('dotenv').config({ path: '.env' });

// Imports
const bodyParser = require('body-parser');
const colorize = require('json-colorizer');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const webPush = require('web-push');


const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;


const clientsStoragePath = './clients.json';
let clients = [];

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

// Server
const app = express();
const jsonBodyParser = bodyParser.json();
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

const pushNotification = (message, data) => {
	const {
		title=`Title ${new Date()}`,
		body=`Notification body ${new Date()}`,
		icon=null, // Icon url is optional
		tag='notification-tag',
		url='/'
	} = message;

	const payload = JSON.stringify({ title, body, icon, tag, url });
	console.log('Notifying with message:');
	console.log('\n', colorize(payload), '\n');

	JSON.parse(data).forEach(client => {
		console.log('Pushing to client:', colorize(client));
		webPush.sendNotification(client, payload)
			.catch(error => console.error(error));
	});
};

/**
 * Client
 */
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

/**
 * Subscribe service
 */
app.post('/subscribe', jsonBodyParser, (req, res) => {
	if (!Object.keys(req.body).length) {
		res.status(500).send({ error: 'Missing request body' });
		return;
	}

	res.status(201).json({});
	clients.push(req.body);

	fs.writeFile(clientsStoragePath, JSON.stringify(clients), function(err) {
		if (err) throw err;
		console.log('Successfully registered client:');
		console.log('\n', colorize(req.body), '\n');
	});
});

/**
 * Notify service
 */
app.post('/notify', jsonBodyParser, (req, res) => {
	try {
		fs.readFile(clientsStoragePath, 'utf8', (err, data) => {
			if (err) {
				res.status(400);
				return;
			}
			res.status(201).json('pushing notification');
			pushNotification(req.body, data);
		});
	} catch (error) {
		console.error(error);
		res.status(400);
	}
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
	console.log(`HTML Client running → http://${server.address().address}:${server.address().port}`);
	console.log(`Subscribe service [POST] → http://${server.address().address}:${server.address().port}/subscribe`);
	console.log(`Notify service [POST] → http://${server.address().address}:${server.address().port}/notify`);
});
