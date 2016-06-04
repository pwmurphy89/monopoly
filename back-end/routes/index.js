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

	connection.query(checkUserQuery, function(err, rows, fields){
		if(rows[0] == undefined){
			connection.query(query, function(err, rows, fields){
				if(err){
					res.json("error");
				}else{
					res.json("added");
				}
			});
		}else{
			res.json("userexists");
		}
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
