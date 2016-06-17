var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'x',
  password : 'x',
  database : 'volopoly'
});
connection.connect();

router.post('/login', function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	var query = 'SELECT * FROM users WHERE username="' + username +'"';
	connection.query(query, function(err, rows, fields){
		if(rows[0] == undefined){
			res.json('nouser');
		}else{
			var passwordMatch = bcrypt.compareSync(password, rows[0].password);
				if(passwordMatch){
					res.json('match');
				}else{
					res.json("nomatch");
				}
		}
	});
});

router.post('/register', function(req, res, next) {
	var username = req.body.username;
	var password = bcrypt.hashSync(req.body.password);
	var email = req.body.email;
	var checkUserQuery = 'SELECT * FROM users WHERE username="' + username +'"';
	var query = 'INSERT INTO users (username, password, email) VALUES ("' + username + '","' + password + '","' + email +'")'; 
	var query1 = 'INSERT INTO games (username) VALUES ("' + username + '")';
	connection.query(checkUserQuery, function(err, rows, fields){
		if(rows[0] == undefined){
			connection.query(query, function(err, rows, fields){
				if(err){
					res.json("error");
				}else{
					res.json("added");
				}
			});
			connection.query(query1, function(error, rows, fields){

			});
		}else{
			res.json("userexists");
		}
	});

});
router.post('/logout', function(req, res, next) {
	var username = req.body.username;
	var turn = req.body.turn;
	// var bank1 = req.body.bank1;
	// var property1 = req.body.property1;
	var position1 = req.body.position1;
	// var bank2 = req.body.bank2;
	// var property2 = req.body.property2;
	var position2 = req.body.position2;

	var query = 'UPDATE games SET turn = "' + turn + '", position1 = "' + position1 + '", position2 = "' + position2 + '" WHERE username = "' + username +'"'; 


	connection.query(query, function(err, rows, fields){
		if(err){
			res.json("error");
		}else{
			res.json("updated");
		}
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
