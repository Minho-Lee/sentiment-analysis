'use strict';

let fs = require('fs');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
var cfenv = require('cfenv'),
		watson = require('watson-developer-cloud'),
		bluemix = require('./config/bluemix'),
		extend = require('util')._extend;

// For local development, put username and password in config
// or store in your environment
var config = {
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: "676a5bd9-8cd8-4d79-8a6c-8790137934d6",
    password: "P0Lz3XYep07Q"
};

// redirect to https if the app is not running locally
if (!!process.env.VCAP_SERVICES) {
    app.enable('trust proxy');
    app.use(function(req, res, next) {
        if (req.secure) {
            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
}

// if bluemix credentials exists, then override local
var credentials = extend(config, bluemix.getServiceCreds('speech_to_text'));
var authorization = watson.authorization(credentials);

// Get token from Watson using your credentials
app.get('/token', function(req, res) {
    authorization.getToken({
        url: credentials.url
    }, function(err, token) {
        if (err) {
            console.log('error:', err);
            res.status(err.code);
        }
        res.send(token);
    });
});

app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(function(req,res,next) {
	res.locals = {
		site: {
			title: 'Tone Analyzer App',
			description: 'Analyzes your tone using speech to text!',
		},
		author: {
			name: 'Minho Lee',
		}
	};
	next();
});

app.get('/', function(req, res) {
  res.render('main');
});
app.get('/app', function(req, res) {
  res.render('app');
});

var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
