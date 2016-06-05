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

	$scope.logOut = function(){
		$cookies.remove('username');
        $location.path('/');
	}
});

myApp.controller('gameController',function($scope, $http,$location){
	var playerOne = true;
	var playerTwo = false;
	var playerOnePosition = 0;
	var playerTwoPosition = 0;
	var playerOneBank = 500;
	var playerTwoBank = 500;

	$scope.message = "Lets Play Monopoly! Player One First";
	$scope.playerOneBank = playerOneBank;
	$scope.playerTwoBank = playerTwoBank;

	var changePlayer = function(){
		if(playerOne){
			$scope.message = "Player Two Turn";
			playerOne = false;
			playerTwo = true;
		}else{
			$scope.message = "Player One Turn";
			playerTwo = false;
			playerOne = true;
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
			document.getElementById(playerOnePosition).innerHTML = playerOnePosition;
			playerOnePosition += diceTotal;
			if(playerOnePosition > 39){
				passGo(1);
				playerOnePosition -= 40;
			}
			document.getElementById(playerOnePosition).innerHTML += 'Player One';
			$scope.position = "Player One rolled a " + diceTotal;
			checkCell(1, playerOnePosition);
		}else{
			document.getElementById(playerTwoPosition).innerHTML = playerTwoPosition;
			playerTwoPosition += diceTotal;
			if(playerTwoPosition > 39){
				passGo(2);
				playerTwoPosition -= 40;
			}
			document.getElementById(playerTwoPosition).innerHTML += 'Player Two';
			$scope.position = "Player Two rolled a " + diceTotal;
			checkCell(2, playerTwoPosition);
		}
	}

	$scope.rollDice = function(){
		var dice1 = Math.floor(Math.random() * 6 + 1);
		var dice2 = Math.floor(Math.random() * 6 + 1);
		var diceTotal = dice1 + dice2;
		if(playerOne){
			updatePosition(1,diceTotal);
		}else{
			updatePosition(2, diceTotal)
		}
		changePlayer();
	}

	var checkCell = function(player, position){
		if(player == 1){
			console.log(position);
		}else{
			console.log(position);
		}
	}





});








myApp.controller('infoController',function($scope, $http,$location){
	$scope.message = "HELLOOOOO";
});