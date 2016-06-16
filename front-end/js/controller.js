var myApp = angular.module('myApp',['ngRoute', 'ngCookies']);

myApp.config(function($routeProvider, $locationProvider){
	$routeProvider.when('/', {
		templateUrl: 'views/welcome.html',
		controller: 'myController'
	}).when('/game',{
		templateUrl: 'views/game.html',
		controller: 'gameController'
	}).when('/info',{
		templateUrl: 'views/info.html',
		controller: 'infoController'
	}).when('/register',{
		templateUrl: 'views/register.html',
		controller: 'myController'
	}).when('/login',{
		templateUrl: 'views/login.html',
		controller: 'myController'
	}).when('/start',{
		templateUrl: 'views/start.html',
		controller: 'gameController'
	})
});

myApp.controller('myController',function($scope, $http,$location, $cookies, $sce){
	
$scope.$watch(function() { 
    return $location.path(); 
    },
    function(param){
        if(param == '/' || param == '/login' || param == '/register'){
           $scope.loggedOut = true;
           $scope.loggedIn = false;
        }else{
         	$scope.loggedOut = false;
         	$scope.loggedIn = true;
         	$scope.username = $cookies.get('username');
        }
	});

$scope.loginForm = function(){
	$http.post('http://localhost:3000/login', {
		username: $scope.username,
		password: $scope.password
	}).then(function successCallback(response){
		if(response.data == "nouser"){
			$scope.message = "No user found.  Please register.";
		}else if(response.data == "nomatch"){
			$scope.message = "Please re-enter password.";
		}else{
			$cookies.put('username', $scope.username);
			$location.path('/game')
		}
	},function errorCallback(response){
		console.log("error");
	})
}

$scope.registerForm = function(){
	if($scope.password == $scope.password2){
		$http.post('http://localhost:3000/register', {
			username: $scope.username,
			password: $scope.password,
			email: $scope.email
		}).then(function successCallback(response){
			if(response.data == "error"){
				$scope.message = "Error. Please register again";
			}else if(response.data == 'userexists'){
				$scope.message = "Username already in use.  Please choose another username.";
			}else{
				$cookies.put('username', username);
				$location.path('/game');
			}
		},function errorCallback(response){
			console.log("error");
		})
	}else{
		$scope.message = "Passwords do not match.  Please submit again."
	}
}

	var oneProperty = [];
	var twoProperty = [];
	var bank;
	var turn;

$scope.logOut = function(){
	for(var i = 0; i<playerOneProperties.length; i++){
		oneProperty.push(playerOneProperties[i].name);
	}
	for(var j = 0; j<playerTwoProperties.length; j++){
		twoProperty.push(playerTwoProperties[j].name);
	}
	if(playerOneTurn){
		turn = 1;
		bank = playerOneBank;
		property = oneProperty;
		position = playerOnePosition;

	}else{
		turn = 2;
		bank = playerTwoBank;
		property = twoProperty;
		position = playerTwoPosition;
	}

	$cookies.remove('username');
    $location.path('/');
    $http.post('http://localhost:3000/logout', {
    	username: $scope.username,
    	turn: turn,
    	bank: bank,
    	property: property,
    	position: position
    }).then(function successCallback(response){
    		if(response.data == "error"){
    			console.log("ERROR");
    		}else if(response.data == "updated"){
    			console.log("We added player one bank into SQL");
    		}
    }, function errorCallback(response){
    	console.log("ERRORCALLBACK");
    });
}
});

myApp.controller('gameController',function($scope, $http,$location){

var socketio = io.connect('http://127.0.0.1:3001');

var playerOnePosition = 0;
var playerTwoPosition = 0;
var imageName1;
var imageName2;
var playerOneTurn;
var playerTwoTurn;
var playerOneProperties = [];
var playerTwoProperties = [];
var purchaseOption = false;
var playerOneMonopoly = false;
var playerTwoMonopoly = false;
$scope.freeParkingBank = 200;
$scope.chanceImage = "chance-back.png";
$scope.chestImage = "chest-back.png";
var color = '';
var railUtil = false;
var playerOneWin = false;
var playerTwoWin = false;
var notEnough = false;
var playerOneSocket = '';
var playerTwoSocket = '';
var playerIAm = 0;


socketio.on('playerNumber', function(data){
	$scope.$apply(function(){
		playerIAm = data.pn;
		console.log(playerIAm);
	});
});

socketio.on('startingGame', function(data){
	$scope.$apply(function(){;
		playerOneTurn = data.playerOneTurn;
		playerTwoTurn = data.playerTwoTurn;
		if(playerOneTurn && playerIAm == 1){
			$scope.playersTurn = true;
		}
	})
});



socketio.on('dice_to_client', function(data){
	document.getElementById(playerOnePosition).innerHTML = "";
	document.getElementById(playerTwoPosition).innerHTML = "";
	$scope.$apply(function(){
		playerOneTurn = data.playerOneTurn;
		playerTwoTurn = data.playerTwoTurn;
		dice1 = data.dice1;
		dice2 = data.dice2;
		$scope.diceTotal = data.diceTotal;
		imageName1 = data.imageName1;
		imageName2 = data.imageName2;
		playerOnePosition = data.playerOnePosition;
		playerTwoPosition = data.playerTwoPosition;
		$scope.jailFreeCardOne = data.jailFreeOne;
		$scope.jailFreeCardTwo = data.jailFreeTwo;
		$scope.playerOneBank =  data.playerOneBank;
		$scope.playerTwoBank = data.playerTwoBank;
		$scope.freeParkingBank = data.freeParkingBank;
		purchaseOption = data.purchaseOption;
		$scope.cell = data.property;
		$scope.rent = data.rent;
		$scope.rentInfo = data.showRent;
		$scope.message = data.message;
		$scope.specialMessage = data.showSpecialMessage;
		$scope.chestImage = data.chestImage;
		$scope.chanceImage = data.chanceImage;
		playerOneWin = data.playerOneWin;
		playerTwoWin = data.playerTwoWin;
		socketID = data.socketID;
		

			console.log(socketID);
	

		updateView();
	});
});

socketio.on('changePlayer',function(data){
	$scope.$apply(function(){
		playerOneTurn = data.playerOneTurn;
		playerTwoTurn = data.playerTwoTurn;
		if(playerIAm == 1 && playerOneTurn){
			$scope.playersTurn = true
		}else{
			$scope.playersTurn = false;
		}
		if(playerIAm == 2 && playerTwoTurn){
			$scope.playersTurn = true;
		}else{
			$scope.playersTurn = false;
		}
	})
		console.log("I am" , playerIAm, "poneTURN: ", playerOneTurn, 'pTWO', playerTwoTurn);
})

socketio.on('purchase_to_client', function(data){
	$scope.$apply(function(){
		$scope.playerOneBank =  data.playerOneBank;
		$scope.playerTwoBank = data.playerTwoBank;
		$scope.playerOneProperties = data.playerOneProperties;
		$scope.playerTwoProperties = data.playerTwoProperties;
		playerOneTurn = data.playerOneTurn;
		playerTwoTurn = data.playerTwoTurn;
		$scope.purchaseMessage = data.purchaseMessage;
		playerOneMonopoly = data.playerOneMonopoly;
		playerTwoMonopoly = data.playerTwoMonopoly;
		$scope.message = data.message;
		$scope.specialMessage = data.showSpecialMessage;
		color = data.color;
		railUtil = data.railUtil;
		notEnough = data.notEnough;
		updatePurchase();
	});
});

socketio.on('notPurchase_to_client', function(data){
	$scope.$apply(function(){
		$scope.purchase = false;
		$scope.purchaseButtons = false;
		document.getElementById("rollButton").disabled = false;
	});
});

socketio.on('rent_to_client', function(data){
	$scope.$apply(function(){
		$scope.purchase = false;
		$scope.purchaseButtons = false;
		$scope.playerOneBank = data.playerOneBank;
		$scope.playerTwoBank = data.playerTwoBank;
		$scope.rent = data.rent;
	});
});

var updateView = function(){
	if(playerOneTurn){
		$scope.whichPlayer = 1;
	}else{
		$scope.whichPlayer = 2;
	}
		$scope.purchase=false;
		document.getElementById(playerOnePosition).innerHTML += "<img src='../css/images/token-ship.png'>";
		document.getElementById(playerTwoPosition).innerHTML +="<img src='../css/images/token-car.png'>";
		document.images['dieOne'].src = imageName1;
		document.images['dieTwo'].src = imageName2;
		$scope.rollInfo =true;
		if(playerOneWin || playerTwoWin){
			endGame();
		}
		if(purchaseOption){	
			$scope.purchaseMessage = " has the option to purchase ";
			$scope.purchase = true;
			$scope.purchaseButtons = true;
			$scope.rent = false;
			document.getElementById("rollButton").disabled = true;
		}
}
var endGame = function(){
	$scope.gameOver = true;
	if(playerOneWin){
	$scope.gameOverMessage = "Player One Wins!";
	}else if(playerTwoWin){
		$scope.gameOverMessage = "Player Two Wins!";
	}
}

var updatePurchase = function(){
	document.getElementById("rollButton").disabled = false;
	$scope.purchaseButtons = false;
	if (playerOneTurn && !notEnough){
		document.getElementById(playerOnePosition).className += " red";
	}
	if(playerTwoTurn && !notEnough){
		document.getElementById(playerTwoPosition).className += " blue";
	}
	if(playerOneMonopoly){
		$scope.specialMessage = true;
		for (var i = 0; i <$scope.playerOneProperties.length; i++){
			if($scope.playerOneProperties[i].group == color){
				document.getElementById($scope.playerOneProperties[i].position).classList.add(color + "one");
			}
		}
	}
	if(playerTwoMonopoly){
		$scope.specialMessage = true;
		for (var i = 0; i <$scope.playerTwoProperties.length; i++){
			if($scope.playerTwoProperties[i].group == color){
				document.getElementById($scope.playerTwoProperties[i].position).classList.add(color + "two");
			}
		}
	}
	if(railUtil){
		$scope.specialMessage = true;
	}	
}

$scope.onePlayerGame = function(){
	onePlayer = true;
	twoPlayer = false;
	$scope.whoRollsFirst = "Please roll to see who's first";
	whosFirst();
	console.log("playing with the computer");
}

$scope.twoPlayerGame = function(){
	onePlayer = false;
	twoPlayer = true;
	$scope.roll = true;
}

$scope.whosFirst = function(){
	var playerOneTotal =  Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
	var playerTwoTotal =  Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
	$scope.total = true;
	$scope.playerOneTotal = playerOneTotal;
	$scope.playerTwoTotal = playerTwoTotal;
	if(playerOneTotal > playerTwoTotal){
		playerOneTurn = true;
		playerTwoTurn = false;
	}else{
		playerOneTurn = false;
		playerTwoTurn = true;
	}
	$scope.play = true;
}

$scope.playNow = function(){
	$location.path('/game');
}

$scope.rollDice = function(){
	socketio.emit('dice_to_server',{
	});
}

$scope.purchaseProperty = function(){
	socketio.emit('purchase_to_server',{
	});
}

$scope.notPurchase = function(){
	socketio.emit('notPurchase_to_server',{
	});
}
});

myApp.controller('infoController',function($scope, $http,$location){
	$scope.message = "HELLOOOOO";
});