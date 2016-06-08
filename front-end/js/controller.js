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
			password: $scope.password,
		}).then(function successCallback(response){
			if(response.data == "nouser"){
				$scope.message = "No user found.  Please register.";
			}else if(response.data == "nomatch"){
				$scope.message = "Please re-enter password.";
			}else{
				$cookies.put('username', $scope.username);
				$location.path('/start')
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
					$location.path('/start');
				}
			},function errorCallback(response){
				console.log("error");
			})
		}else{
			$scope.message = "Passwords do not match.  Please submit again."
		}
	}

	$scope.logOut = function(){
		$cookies.remove('username');
        $location.path('/');
	}
});

myApp.controller('gameController',function($scope, $http,$location){
	window.playerOnePosition = 0;
	window.playerTwoPosition = 0;
	window.playerOneBank = 500;
	window.playerTwoBank = 500;
	window.freeParkingBank = 200;
	window.playerOneInJail = false;
	window.playerTwoInJail = false;
	window.chanceImage  = "chance-back.png";
	window.chestImage = "chest-back.png";
	var onePlayer;
	var twoPlayer;
	var playerOneCounter = 1;
	var playerTwoCounter = 1;
	//for development
	var playerOneTurn;
	var playerTwoTurn;
	var playerOneProperties = [];
	var playerTwoProperties = [];
	$scope.playerOneProperties = playerOneProperties;
	$scope.playerTwoProperties = playerTwoProperties;
	$scope.playerOneBank = playerOneBank;
	$scope.playerTwoBank = playerTwoBank;
	$scope.freeParkingBank = freeParkingBank;
	$scope.chanceImage = chanceImage;
	$scope.chestImage = chestImage;

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
	var changePlayer = function(){
		if(playerOneTurn){
			playerOneTurn = false;
			playerTwoTurn = true;
		}else{
			playerOneTurn = false;;
			playerTwoTurn = false;
			playerOneTurn = true;
		}
	}

	var passGo = function(player){
		if(player == 1){
			playerOneBank += 200;
		}else{
			playerTwoBank += 200;
		}
		$scope.playerOneBank = playerOneBank;
		$scope.playerTwoBank = playerTwoBank;
	}

	var updatePosition = function(player, diceTotal){
		if (player == 1){
			document.getElementById(playerOnePosition).innerHTML = '';
			if(playerTwoPosition == playerOnePosition){
				document.getElementById(playerOnePosition).innerHTML = "<img src='../css/images/token-car.png'>";
			}
			playerOnePosition += diceTotal;
			if(playerOnePosition > 39){
				passGo(1);
				playerOnePosition -= 40;
			}
			document.getElementById(playerOnePosition).innerHTML += "<img src='../css/images/token-ship.png'>";
			checkCell(1, playerOnePosition);
		}else{
			document.getElementById(playerTwoPosition).innerHTML = '';
			if(playerOnePosition==playerTwoPosition){
				document.getElementById(playerOnePosition).innerHTML += "<img src='../css/images/token-ship.png'>";
			}
			playerTwoPosition += diceTotal;
			if(playerTwoPosition > 39){
				passGo(2);
				playerTwoPosition -= 40;
			}
			document.getElementById(playerTwoPosition).innerHTML +="<img src='../css/images/token-car.png'>";
			checkCell(2, playerTwoPosition);
		}
	}

	$scope.rollDice = function(){
		$scope.specialMessage = false;
		$scope.playerOneBank = playerOneBank;
		$scope.playerTwoBank = playerTwoBank;
		$scope.chanceImage = "chance-back.png";
		$scope.chestImage = "chest-back.png";

		var dice1 = Math.floor(Math.random() * 6 + 1);
		var imageName1 = "d" + dice1 + ".gif";
	    document.images['dieOne'].src = "css/images/" + imageName1;

		var dice2 = Math.floor(Math.random() * 6 + 1);
		var imageName2 = "d" + dice2 + ".gif";
	    document.images['dieTwo'].src = "css/images/" + imageName2;

		// var diceTotal = dice1 + dice2;
		var diceTotal = 2;

		//for development
		if(playerOneTurn == undefined || playerTwoTurn == undefined){
			playerOneTurn = true;
		}
		if(playerOneTurn){
			if(playerOneInJail){
				jailFunction(1, dice1, dice2, diceTotal);
			}else{
				updatePosition(1,diceTotal);
			}
		}else if(playerTwoTurn){
			if(playerTwoInJail){
				window.message =  "Player Two is in Jail.";
				jailFunction(2, dice1, dice2, diceTotal);
			}else{
				updatePosition(2, diceTotal);
			}
		}
		changePlayer();
	}

	var jailFunction = function(player, dice1, dice2, diceTotal){
		if(player == 1){
			if (dice1 === dice2){
				window.message = "Player One rolled doubles and got out!";
				playerOneInJail = false;
				updatePosition(1, diceTotal);
				playerOneCounter = 1;
			}else{
				if (playerOneCounter == 3){
					window.message = "Player One has rolled three times and can leave jail next turn.";
					playerOneInJail = false;
					playerOneCounter = 1;
				}else{
					window.message = "Player One has rolled " + playerOneCounter + " times while in Jail"; 
					playerOneCounter += 1;
				}
				checkCell(1, 10);
			}
		
		}else if(player ==2){
			if (dice1 === dice2){
				window.message = "Player Two rolled doubles and got out!";
				playerTwoInJail = false;
				updatePosition(2, diceTotal);
				playerTwoCounter = 1;
			}else{
				if(playerTwoCounter == 3){
					window.message = "Player Two has rolled three times and can leave jail next turn.";
					playerTwoInJail = false;
					playerTwoCounter = 1;
				}else{
					window.message = "Player Two has rolled " + playerTwoCounter + " times while in Jail";
					playerTwoCounter += 1;
				}
				checkCell(2, 10);
			}
		}
	}

	$scope.purchaseProperty = function(){
		$scope.purchaseMessage = " purchased ";
		cells[$scope.playerPosition].status = "owned";
		$scope.purchaseButtons = false;
		document.getElementById("rollButton").disabled = false;
		if($scope.whichPlayer == 1){
			playerOneProperties.push(cells[$scope.playerPosition]);
			document.getElementById($scope.playerPosition).className += " red";
			playerOneBank -= cells[$scope.playerPosition].price;
			$scope.playerOneBank = playerOneBank;
		}else if($scope.whichPlayer == 2){
			playerTwoProperties.push(cells[$scope.playerPosition]);
			document.getElementById($scope.playerPosition).className += " blue";
			playerTwoBank -= cells[$scope.playerPosition].price;
			$scope.playerTwoBank = playerTwoBank;
		}
		checkGroup();
	}
	$scope.notPurchase = function(){
		$scope.purchase = false;
		$scope.purchaseButtons = false;
		document.getElementById("rollButton").disabled = false;
	}
	var payRent = function(player, position){
		if(player == 1){
			playerOneBank -= cells[position].rent;
			playerTwoBank += cells[position].rent;
		}else{
			playerTwoBank -= cells[position].rent;
			playerOneBank += cells[position].rent;
		}
	}

	var checkCell = function(player, position){
		$scope.rollInfo = true;
		$scope.playerPosition = position;
		$scope.whichPlayer = player;
		$scope.cell = cells[position];
		if(cells[position].status == "vacant"){
			$scope.purchaseMessage = " has the option to purchase ";
			$scope.purchase = true;
			$scope.purchaseButtons = true;
			$scope.rent = false;
			document.getElementById("rollButton").disabled = true;
		}else if(cells[position].status == "owned"){
			$scope.purchase = false;
			$scope.purchaseButtons = false;
			$scope.rent = true;
			payRent(player, position);
		}else if(cells[position].status == "public"){
			$scope.purchase = false;
			$scope.purchaseButtons = false;
			$scope.rent = false;
			specialSpace(player, cells[position]);
		}
	}

	var specialSpace = function(player, position){
		$scope.cell = position;
		console.log(position);
		var position = position.position;
		var player = player;
		if(position == 0){
			window.message = "Collect $200";
		}
		if(position == 2 || position == 17 || position == 33){
			chestCard(player, position);
			$scope.chestImage = chestImage;
		}
		if(position == 7 || position == 22 || position == 36){
			chanceCard(player, position);
			$scope.chanceImage = chanceImage;
		}
		if(position == 4){
			if(player == 1){
				playerOneBank -= Math.floor(playerOneBank * .1);
			}else{
				playerTwoBank -= Math.floor(playerTwoBank * .1);
			}
			window.message = "Income Tax: Pay 10%";
		}
		if(position == 38){
			if(player == 1){
				playerOneBank -= 100;
			}else{
				playerTwoBank -= 100;
			}
			window.message = "Luxury Tax: Pay $100";
		}
		if(position == 20){
			window.message = 'Free Parking';
			freeParking(player);
			message = "Player " + player + " collects Free Parking Bank!";
		}
		if(position == 30){
			gotojail(player);
			message = "Do not pass GO! Do not collect $200! Get out after three rolls or roll doubles.";
		}
		if(position == 10){

		}

		$scope.playerOneBank = playerOneBank;
		$scope.playerTwoBank = playerTwoBank;
		$scope.freeParkingBank = freeParkingBank;
		$scope.message = window.message;
		$scope.specialMessage = true;
	}

	var freeParking = function(player){
		if (player == 1){
			playerOneBank += freeParkingBank;
		}else if (player == 2){
			playerTwoBank += freeParkingBank;
		}
		freeParkingBank = 200;
		$scope.freeParkingBank = freeParkingBank;
	}

	var checkGroup = function(){
		//loop through playerOneProperties/ playerTwo Properties
		// to check if player has all spots of same group//
		//if so, do something
	}

});

myApp.controller('infoController',function($scope, $http,$location){
	$scope.message = "HELLOOOOO";
});