var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express ();

app.set('views', 'src/views');
app.set('view engine', 'jade');

app.use(session({
	secret: 'De lievelingskleur van Yoni is blauw',
	resave: true,
	saveUninitialized: false
}));

	app.use(express.static('public')); // elk statische file dat je gebruikt leest ie uit de folder public.
	app.use(bodyParser.urlencoded({extended: true}));

	var pg = require('pg');

	var Sequelize = require('sequelize');

	var sequelize = new Sequelize("postgres://sara:123@localhost/sara");
// var sequelize = new Sequelize ('blog', 'sara', nul, {
// 	host: 'localhost',
// 	dialect: 'postgres'
// })

var user = sequelize.define("user", {
	username: Sequelize.STRING,
	password: Sequelize.STRING
}, {freezeTableName: true});

var message = sequelize.define("message", {
	username: Sequelize.STRING,
	title: Sequelize.STRING,
	text: Sequelize.TEXT
}, {freezeTableName: true});

//////////////////////////////////

app.get('/', function (request, response){

	response.render("index");
});

app.post('/register', function (request, response){

	var username = request.body.newUserName;
	var unLowerCase= username.toLowerCase();


	if (request.body.newPassWord == request.body.checkPassWord) {

		user.create({
			username: unLowerCase,
			password: request.body.newPassWord
		});

		request.session.logIn = true;

		var unUpperCase = unLowerCase.charAt(0).toUpperCase() + unLowerCase.slice(1);    	

		request.session.unUpperCase = unUpperCase

		response.redirect('/profile');

	} else {

		var error = "typo in password, try again"
		response.render("index", {error: error})
	}
})

app.post('/login', function (request, response){

	var username = request.body.userName;
	var unLowerCase = username.toLowerCase();
	request.session.unLowerCase = unLowerCase;


	user.findAll({ 
		where: {
			username: unLowerCase, 
			password: request.body.passWord
		}
	})

	.then(function(data){

		if (data.length == 0) {

			response.render("index", {none: "No matching users"});

		} else { 

			request.session.logIn = true;

			var nameUser = data[0].username

			var unUpperCase = nameUser.charAt(0).toUpperCase() + nameUser.slice(1); //maak username met hoofdleter voor animatie

			request.session.unUpperCase = unUpperCase// you can put everything into a session to use in a different route

			response.redirect('/profile');

		}

	})
})

app.get('/profile', function (request, response) {

	var unLowerCase = request.session.unLowerCase // gebruikersnaam in kleine letters;
	var logIn = request.session.logIn; // login-in is true;

	if (logIn === true) {

		message.findAll({ 
			where: {
				username: unLowerCase, 
			}
		})

		.then(function(data){
				
			var unUpperCase = request.session.unUpperCase // naam user boven logout link en intro fade out;

			if (data.length == 0) {

				response.render("profile", {nameUser: unUpperCase, all: "You have not posted a message yet"});

			} else {  

				var messages = [];

				for(i = 0; i < data.length; i++) {

					messageObject = {
						title: data[i].title,
						text: data[i].text
					}

				messages.push(messageObject);

				}

			request.session.messages = messages;

			response.render("profile", {nameUser: unUpperCase}); 
			// all: messages meegeven aan profile om lijst berichten door user weer te geven zonder AJAX

			}
		})	
		
	} else {

		response.render('index', {none: "Please log in to view your profile"});
	}
})

app.get('/myposts', function (request, response){

	var unLowerCase = request.session.unLowerCase

	message.findAll({ 
			where: {
				username: unLowerCase, 
			}
		})
	.then(function(data){

		var messages = [];

		for(i = 0; i < data.length; i++) { 

			messages.push(data[i].title + ": " + data[i].text + "<br>")

		}

	response.send(messages)

	})
})

app.get('/allposts', function (request, response){

	message.findAll().then(function(data){

		console.log("kikkers zijn groen")

		var messages = [];

		for(i = 0; i < data.length; i++) { 

			messages.push(data[i].title + ": " + data[i].text + "<br>")

		}

	response.send(messages)

	})
})


app.post('/profile', function(request, response){

	var unLowerCase = request.session.unLowerCase;
	var unUpperCase = request.session.unUpperCase;

	if (request.body.newTitle && request.body.newText !== []) {

		console.log("Creating message in database");

		message.create({

			username: unLowerCase,
			title: request.body.newTitle,
			text: request.body.newText
		});

		// var messages = request.session.messages

		// var newMessage = {
		// 	title: request.body.newTitle,
		// 	text: request.body.newText
		// }

		// console.log(newMessage);

		// messages.push(newMessage);

		response.render("profile", {nameUser: unUpperCase, error: "Post Successfully written"});

	} else {

		response.render('/profile', {nameUser: unUpperCase, error: "empty field, please fill in both forms"})

	}
})


app.get('/logout', function (request, response){
			request.session.logIn = false;
			response.render('index', {error: "Successfully logged out"})

})


sequelize.sync().then(function () { // creating a table, only when you first start the server; promise, after syncing then start the server.

	var server = app.listen(3000, function (){
		console.log('Example app listening on port: ' + server.address().port);

	})
});