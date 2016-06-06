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
	var playerOnePosition = 0;
	var playerTwoPosition = 0;
	var playerOneBank = 500;
	var playerTwoBank = 500;
	var onePlayer;
	var twoPlayer;
	//for development
	var playerOneTurn;
	var playerTwoTurn;

	$scope.playerOneBank = playerOneBank;
	$scope.playerTwoBank = playerTwoBank;

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
			$scope.position = "Player One rolled a " + diceTotal;
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
			$scope.position = "Player Two rolled a " + diceTotal;
			checkCell(2, playerTwoPosition);
		}
	}

	$scope.rollDice = function(){
		var dice1 = Math.floor(Math.random() * 6 + 1);
		var imageName1 = "d" + dice1 + ".gif";
        document.images['dieOne'].src = "css/images/" + imageName1;

		var dice2 = Math.floor(Math.random() * 6 + 1);
		var imageName2 = "d" + dice2 + ".gif";
        document.images['dieTwo'].src = "css/images/" + imageName2;

		var diceTotal = dice1 + dice2;
		//for development
		if(playerOneTurn == undefined || playerTwoTurn == undefined){
			playerOneTurn = true;
		}

		if(playerOneTurn){
			updatePosition(1,diceTotal);
		}else{
			updatePosition(2, diceTotal);
		}
		changePlayer();
	}
	$scope.purchaseProperty = function(){
		cells[$scope.playerPosition].status = "owned";
		
		if($scope.whichPlayer == 1){
			document.getElementById($scope.playerPosition).className += " red";
			playerOneBank -= cells[$scope.playerPosition].price;
			$scope.playerOneBank = playerOneBank;
		}else if($scope.whichPlayer == 2){
			document.getElementById($scope.playerPosition).className += " blue";
			playerTwoBank -= cells[$scope.playerPosition].price;
			$scope.playerTwoBank = playerTwoBank;
		}
	}
	$scope.notPurchase = function(){
		$scope.purchase = false;
	}
	var payRent = function(player, position){
		if(player == 1){
			playerOneBank -= cells[position].rent;
			playerTwoBank += cells[position].rent;
		}else{
			playerTwoBank -= cells[position].rent;
			playerOneBank += cells[position].rent;
		}
		$scope.playerOneBank = playerOneBank;
		$scope.playerTwoBank = playerTwoBank;
	}

	var checkCell = function(player, position){
		$scope.rollInfo = true;
		$scope.playerPosition = position;
		$scope.whichPlayer = player;
		$scope.cellName = cells[position].name;
		if(cells[position].status == "vacant"){
			$scope.purchase = true;
		}else if(cells[position].status == "owned"){
			$scope.purchase = false;
			$scope.rent = true;
			payRent(player, position);
		}else if(cells[position].status == "public"){
			$scope.purchase = false;
		}
	}

});

myApp.controller('infoController',function($scope, $http,$location){
	$scope.message = "HELLOOOOO";
});