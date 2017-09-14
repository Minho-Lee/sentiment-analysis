'use strict';

let fs = require('fs');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
var cfenv = require('cfenv');


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
})

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
