
var express = require('express');
var bodyParser = require('body-parser');
// var pg = require('pg');
var fs = require('fs');

// var Sequielie = require('sequelize');
// var sequelize = new Sequelize ('blog', 'sara', nul, {
// 	host: 'localhost',
// 	dialect: 'postgres'
// });

// var Post = sequelize.define('post', {
// 	title: Sequelize.STRING,
// 	body: Sequielize.TEXT
// });

// sequelize.sync().then(function () { // creating a table, only when you first start the server; promise, after syncing than start the server.
// 	Post.create({
// 		title:
// 		text:
// 	})
// })

var app = express ();
// var conString = "postgres://sara:123@localhost/sara";

	app.set('views', 'src/views');
	app.set('view engine', 'jade');

app.use(express.static('public')); // elk statische file dat je gebruikt leest ie uit de folder public.
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (request, response) {

	response.render("index");
});

var server = app.listen(3000, function (){
	console.log('Example app listening on port: ' + server.address().port);
});