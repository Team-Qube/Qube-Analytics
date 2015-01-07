// dependencies
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var User = require('./app/user.js');

mongoose.connect('mongodb://localhost/database');

//setup express app
app.use("/static", express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 4456);

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Socket.IO
var usersData = [];

User.find({}, function(err, user){
	if(err) {
		console.log("ERROR: " + err);
	}
	else {
		for(var i = 0; i < user.length; i++){
			usersData.push({
				id: user[i]._id,
				lastLogin: user[i].lastLogin,
				loginCount: user[i].loginCount
			});
		}
		console.log(usersData);
	}
});


// Node.js
app.get('/', function(req, res) {
    res.render('index.html');
});

// Setup Router for REST API
var router = express.Router();

io.on('connection', function (socket) {
	socket.emit('init', {data : usersData});
});

router.route('/update/:data')
	.post(function(req, res){
		var postData = JSON.parse(req.params.data);
		res.json({
			status: "Success"
		});
		var updateData;
		User.findById(postData.data, function(err,user){
			if(err){
			}
			else {
				updateData = { id: user._id, lastLogin: user.lastLogin, loginCount: user.loginCount };
				console.log('emit!');
				io.emit('update', {data : updateData});
			}
		});
	});

app.use('/api', router);

server.listen(app.get('port'), function(){
	console.log("Listening on port localhost:" + app.get('port'));
});