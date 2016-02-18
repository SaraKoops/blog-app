
var express = require('express');
var bodyParser = require('body-parser');
var app = express ();

	app.set('views', 'src/views');
	app.set('view engine', 'jade');

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

// var post = sequelize.define('post', {
// 	title: Sequelize.STRING,
// 	body: Sequielize.TEXT
// });

//////////////////////////////////

app.get('/', function (request, response){

	response.render("index");
});

app.post('/register', function (request, response){

	if (request.body.newPassWord == request.body.checkPassWord) {

		user.create({
	    username: request.body.newUserName,
	    password: request.body.newPassWord
	  });

	} else {

		console.log("typo in password");

		var error = "typo in password, try again"
		response.render("index", {error: error})

	}
// response.redirect('/loggedin')
})

app.post('/login', function (request, response){

	user.findAll({ 
		where: {
			username: request.body.userName, 
			password: request.body.passWord
		}
	})
		
		.then(function(data){

			if (data.length == 0) {

				response.render("index", {none: "No matching users"});

			} else { 

				var nameUser = data[0].username

				var naamHoofdletter = undefined

				function capitalizeFirstLetter(nameUser) {

	    			naamHoofdletter = nameUser.charAt(0).toUpperCase() + nameUser.slice(1);

	    			console.log(naamHoofdletter);
				}

				capitalizeFirstLetter(nameUser);

				response.render('blog', {nameUser: naamHoofdletter})

			}

		})
})


sequelize.sync().then(function () { // creating a table, only when you first start the server; promise, after syncing then start the server.

	var server = app.listen(3000, function (){
	console.log('Example app listening on port: ' + server.address().port);

	})
});