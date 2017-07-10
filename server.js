//To Change when installing for a new handle: webhook_url needs to be updated for the new app
//So does the arguements in the if statement -----> req.body.event.text.includes(????)
//Additionally you need to perform a digital handshake with each new app. This occurs with Slack's Events API


//require the express nodejs module
var express = require('express'),
	//set an instance of exress
	app = express(),
	//require the body-parser nodejs module
	bodyParser = require('body-parser'),
	//require the path nodejs module
	path = require("path");

//this is the package the allows us to use webhooks to
var Slack = require('slack-node');
var webhook_url = 'https://hooks.slack.com/services/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';
slack = new Slack();
slack.setWebhook(webhook_url);


//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));


app.post('/',function(req, res){

	//This if tests if the incoming event is the URL verification handshake.
	if (req.body.type == "url_verification") {
		res.setHeader('Content-Type', 'text');
		console.log(req.body.challenge);
			res.writeHead(200, {"Content-Type": "application/x-www-form-urlencoded"});
			  var otherArray = req.body.challenge;
			  var json = JSON.stringify({
			    body: otherArray,
			  });
				res.end(json);
	} // end of verification if

	//verifies that the event type is a message
	else if (req.body.event.type == "message") {
		console.log("Oh! I got a message");
		if (req.body.event.text.includes("abe") || req.body.event.text.includes("goat") || req.body.event.text.includes("abraham") || req.body.event.text.includes("banana")) {
			res.writeHead(200, {"Content-Type": "application/json"});

			// console.log("whats?");




			//this is the code that sends something back
			slack.webhook({mrkdown: false, text: '*Abe* is ALWAYS listening...'}, function (err, response) {
					// console.log(response);
				});


			console.log("got to the end");
		}
		res.end();
	} // end of message if
	else {
		res.writeHead(200, {"Content-Type": "application/x-www-form-urlencoded"});
		console.log("ops, I don't know this event type.");
		console.log(req);
		res.end();
	}


});



//wait for a connection
app.listen(3000, function () {
  console.log('Server is running. Point your browser to: http://localhost:3000');
});
