var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var bcrypt = require('bcrypt');

app.set('views', 'src/views');
app.set('view engine', 'jade');

app.use(session({
	secret: 'De lievelingskleur van Yoni is blauw',
	resave: true,
	saveUninitialized: false
}));

	app.use(express.static('public')); // every static file (jade) grapping from folder public
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

var comment = sequelize.define("comment", {
	username: Sequelize.STRING,
	messageId: Sequelize.INTEGER,
	comment: Sequelize.TEXT
}, {freezeTableName: true});

message.hasMany(comment);
comment.belongsTo(message);

//////////////////////////////////

app.get('/', function (request, response){

	response.render("index");
});

app.post('/register', function (request, response){

	var username = request.body.newUserName;
	var unLowerCase= username.toLowerCase();

	if (username && request.body.newPassWord !== "") {

		if (request.body.newPassWord == request.body.checkPassWord) {

			var password = request.body.newPassWord// encryption
			bcrypt.hash(password, 8, function(err, hash) {

	  			if (err !== undefined) {
	    			console.log(err);
	  			} else {
	    			user.create({
						username: unLowerCase,
						password: hash
					});
	  			}

			});

			request.session.logIn = true; // in order to redirect to profile of user
			var unUpperCase = unLowerCase.charAt(0).toUpperCase() + unLowerCase.slice(1);    	
			request.session.unUpperCase = unUpperCase;
			request.session.unLowerCase = unLowerCase;

			response.redirect('/profile');

		} else {

			var error = "typo in password, try again"
			response.render("index", {error: error})
		}
	} else {

		var error = "empty field, please fill in both forms"
		response.render("index", {error: error})
	}
})

app.post('/login', function (request, response){

	var username = request.body.userName;
	var unLowerCase = username.toLowerCase();
	request.session.unLowerCase = unLowerCase;
	var password = request.body.passWord;

	user.findOne({
			where: {
				username: unLowerCase,
			}
		}).then(function(user) {
			bcrypt.compare(password, user.password, function(err, result) {
				if (err !== undefined) {
					console.log(err);
					response.render("index", {none: "No matching users"});
				} else {

					request.session.logIn = true;

					var nameUser = request.body.userName;

					var unUpperCase = nameUser.charAt(0).toUpperCase() + nameUser.slice(1); //maak username met hoofdleter voor animatie

					request.session.unUpperCase = unUpperCase// you can put everything into a session to use in a different route

					response.redirect('/welcome');

				}
			})
		})
});


app.get('/welcome', function (request, response) { // seperate route for welcome animation

	var logIn = request.session.logIn; // login-in is true;

	if (logIn === true) {

		var unUpperCase = request.session.unUpperCase // to use name user for the intro fade out;

		response.render('welcome', {nameUser: unUpperCase});

	} else {

		response.render('index', {none: "Please log in to view your profile"});
	}
})

app.get('/profile', function (request, response) {

	var unLowerCase = request.session.unLowerCase // username in lowercase to find messages user
	var logIn = request.session.logIn; // login-in is true;

	if (logIn === true) {

		message.findAll({ 
			where: {
				username: unLowerCase, 
			}
		})

		.then(function(data){

			var unUpperCase = request.session.unUpperCase // name user for logout link

			if (data.length == 0) {

				response.render("profile", {nameUser: unUpperCase, all: "You have not posted a message yet"});

			} else {  

				response.render("profile", {nameUser: unUpperCase});
			}
		})	
		
	} else {

		response.render('index', {none: "Please log in to view your profile"});
	}
})

app.get('/myposts', function (request, response){ // AJAX for the messages of the user

	var unLowerCase = request.session.unLowerCase

	console.log("AJAX usernam: " + unLowerCase);

	message.findAll({ 
		where: {
			username: unLowerCase, 
		}
	})
	.then(function(data){

		var messages = [];

		for(i = 0; i < data.length; i++) { 

			messages.push("<a href='/profile/message/" + data[i].id + "'>" + data[i].title + "</a>" + ": " + data[i].text + "<br>")
			//pushing the id of the message in the a link in order to view the message on seperate route. Note the double " & '

		}

		console.log("AJAX my messages: " + messages);

		response.send(messages)

	})
})

app.get('/allposts', function (request, response){ // AJAX for list of all messages

	message.findAll().then(function(data){

		var messages = [];

		for(i = 0; i < data.length; i++) { 

			messages.push("<a href='/profile/message/" + data[i].id + "'>" + data[i].title + "</a>" + ": " + data[i].text + "<br>")

		}

		response.send(messages)
	})
})

app.get('/createpost', function (request, response){ //AJAX to write message to database
	
	var nTitle = request.query.baby;
	var nText = request.query.maybe;
	var unLowerCase = request.session.unLowerCase;

	if (nTitle && nText !== "") {

		console.log("Creating message in database with AJAX");

		message.create({

			username: unLowerCase,
			title: nTitle,
			text: nText
		});

		response.send("post succesfully created");

	} else {

		response.send("empty field, please fill in both forms");

	}
})

app.get('/profile/message/:id', function (request, response){ // route to render 3rd page to show specific message and its comments

	var logIn = request.session.logIn;

	var messageId = request.params.id;
	request.session.messageId = messageId; // created a session to link message-id to comment

	if (logIn === true) { 

		console.log("request parameter: " + messageId);

		message.findAll({
			where: {
				id: messageId
			}
		})
		.then(function(data){

			var username = data[0].username;
			var author = username.charAt(0).toUpperCase() + username.slice(1);
			var unUpperCase = request.session.unUpperCase
			var title = data[0].title;
			var text = data[0].text;
			var date = data[0].createdAt;

			response.render('message', {id: messageId, username: author, title: title, text: text, date: date, nameUser: unUpperCase});
		})

	}

})

app.post('/profile/message/:id', function (request, response){ // write comment to database

	console.log("commentpost is: " + request.body.comment)

	if (request.body.comment !== []) {

		var unLowerCase = request.session.unLowerCase;
		var messageId = request.session.messageId;

		console.log(messageId);

		comment.create({
			username: unLowerCase,
			messageId: messageId,
			comment: request.body.comment
		});

		console.log("comment created")

		response.redirect('back'); // this send it back to last route

	} else {

		response.end();
	}
})

app.get('/comments', function (request, response){ // AJAX route to load comments

	var messageId = request.session.messageId;

	comment.findAll({ 
		where: {
			messageId: messageId, 
		}
	})
	.then(function(data){

		var comments = [];

		for(i = 0; i < data.length; i++) { 

			comments.push({comment: data[i].comment, username: data[i].username, date: data[i].createdAt})
		}

		console.log("dit zijn de comments: " + comments)

		response.send(comments);

	})

})


app.get('/logout', function (request, response){ // end all sessions
	request.session.logIn = false;
	request.session.unLowerCase = "";
	request.session.unUpperCase = "";
	request.session.messageId = "";
	response.render('index', {error: "Successfully logged out"})

})


sequelize.sync().then(function () { // creating a table, only when you first start the server; promise, after syncing then start the server.

	var server = app.listen(3000, function (){
		console.log('Example app listening on port: ' + server.address().port);

	})
});