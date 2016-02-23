
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
});

var message = sequelize.define("message", {
	username: Sequelize.STRING,
	title: Sequelize.STRING,
	text: Sequelize.TEXT
});

//////////////////////////////////

app.get('/', function (request, response){

	response.render("index");
});

app.post('/register', function (request, response){

	var username = request.body.newUserName;
	var usernameKleineLetter = username.toLowerCase();


	if (request.body.newPassWord == request.body.checkPassWord) {

		user.create({
			username: usernameKleineLetter,
			password: request.body.newPassWord
		});

		request.session.logIn = true;

		var lcusername = request.body.newUserName;
		var naamHoofdletter = undefined;

		function capitalizeFirstLetter(username) {

			naamHoofdletter = lcusername.charAt(0).toUpperCase() + lcusername.slice(1);    	
		}

		capitalizeFirstLetter(lcusername);

		request.session.capitalLetter = naamHoofdletter

		response.redirect('/profile')

	} else {

		console.log("typo in password");

		var error = "typo in password, try again"
		response.render("index", {error: error})

	}
})

app.post('/login', function (request, response){

	var username = request.body.userName;
	var usernameKleineLetter = username.toLowerCase();
	request.session.kleineLetter = usernameKleineLetter


	user.findAll({ 
		where: {
			username: usernameKleineLetter, 
			password: request.body.passWord
		}
	})

	.then(function(data){

		if (data.length == 0) {

			response.render("index", {none: "No matching users"});

		} else { 

			request.session.logIn = true;

			var nameUser = data[0].username

			//////////////////////////////////////////// gebruikersnaam met hoofdletter wanneer user inlogt

			var naamHoofdletter = undefined

			function capitalizeFirstLetter(nameUser) {

				naamHoofdletter = nameUser.charAt(0).toUpperCase() + nameUser.slice(1);
			}

			capitalizeFirstLetter(nameUser);

			request.session.capitalLetter = naamHoofdletter // you can put everything into a session to use in a different route

			////////////////////////////////////////////////

			response.redirect('/profile');

			}

		})
})

app.get('/profile', function (request, response) {

	var usernameKleineLetter = request.session.kleineLetter // gebruikersnaam in kleine letters

	var logIn = request.session.logIn; // login-in is true

	if (logIn === true) {

		message.findAll({ 
			where: {
				username: usernameKleineLetter, 
			}
		})

		.then(function(data){

			console.log(data);

			////// naam user boven logout link en intro fade out
				
			var nameUser = request.session.capitalLetter

			//////

			if (data.length == 0) {

				response.render("profile", {nameUser: nameUser, all: "You have not posted a message yet"});

			} else {  

				var message = data.title + ": " + data[i].text;

				response.render("profile", {nameUser: nameUser, all: message});

			}
		})	
		
	} else {

		response.render('index', {none: "Please log in to view your profile"});
	}
})


app.post('/profile', function(request, response){

			var usernameKleineLetter = request.session.kleineLetter

			console.log(usernameKleineLetter);


			if (request.body.newTitle && request.body.newText !== []) {

				console.log("test")

		message.create({

			username: usernameKleineLetter,
			title: request.body.newTitle,
			text: request.body.newText
		});

	} else {

		response.render('/profile', {error: "empty field, please fill in both forms"})

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