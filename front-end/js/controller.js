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
$scope.freeParkingBank = 200;


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

			updateView();
		});
	});

	socketio.on('purchase_to_client', function(data){

		$scope.$apply(function(){
			$scope.playerOneBank =  data.playerOneBank;
			$scope.playerTwoBank = data.playerTwoBank;
			$scope.playerOneProperties = data.playerOneProperties;
			$scope.playerTwoProperties = data.playerTwoProperties;
			playerOneTurn = data.playerOneTurn;
			playerTwoTurn = data.playerTwoTurn;
			$scope.purchaseMessage = data.purchaseMessage;
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
		$scope.chanceImage = "chance-back.png";
		$scope.chestImage = "chest-back.png";
		$scope.utilityChanceInfo = false;
		if(purchaseOption){	
			$scope.purchaseMessage = " has the option to purchase ";
			$scope.purchase = true;
			$scope.purchaseButtons = true;
			$scope.rent = false;
			document.getElementById("rollButton").disabled = true;
		}
}

var updatePurchase = function(){

	document.getElementById("rollButton").disabled = false;
	$scope.purchaseButtons = false;
	if (playerOneTurn){
		document.getElementById(playerOnePosition).className += " red";
	}else{
		document.getElementById(playerTwoPosition).className += " blue";
	}		
// 	checkMonopoly(2, cells[$scope.playerPosition].group);
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

function checkMonopoly(player, color){
	if(player == 1){
		var propertyOneGroup = [];
		var groupOne;
	    for(i=0; i<playerOneProperties.length; i++){
	        groupOne = playerOneProperties[i].group;
	        propertyOneGroup[groupOne] = 0;
	    }
	    for(i=0; i<playerOneProperties.length; i++){
	        groupOne = playerOneProperties[i].group;
	       	propertyOneGroup[groupOne]++;
		    
		    if(groupOne == "Railroad"){
	    		playerOneProperties[i].rent = playerOneProperties[i].rent * Math.pow(2, propertyOneGroup[groupOne] -1);
	    		$scope.specialMessage = true;
                $scope.message = "Player 1 will collect $" + playerOneProperties[i].rent + " on all owned Railroads";
		    	document.getElementById(playerOneProperties[i].position).classList.add(color + "one");
		    }
		    else if(groupOne == "Utility"){
		    	var multiplier = (propertyOneGroup[groupOne]==1) ? 4 : 10;
		    	playerOneProperties[i].rent = $scope.diceTotal * multiplier;
		    	$scope.specialMessage = true;
                $scope.message = " Rent is now  " + multiplier + " times amount shown on dice";
		    	document.getElementById(playerOneProperties[i].position).classList.add(color + "one");
			}else{
				$scope.message = '';
			}

		}
		if((propertyOneGroup[color] == byGroup[color]) && (groupOne != "Utility") && (groupOne != "Railroad")){
            for (var i = 0; i <playerOneProperties.length; i++){
                if(playerOneProperties[i].group == color){
                    playerOneProperties[i].rent = playerOneProperties[i].rent * 2;
                    $scope.specialMessage = true;
                    $scope.message = " Player One now has a Monopoly! Rent is doubled!";
                    document.getElementById(playerOneProperties[i].position).classList.add(color + "one");
                }
            }
        }
	}else if(player == 2){
		var propertyTwoGroup = [];
		var groupTwo;
	    for(i=0; i<playerTwoProperties.length; i++){
	        groupTwo = playerTwoProperties[i].group;
	        propertyTwoGroup[groupTwo] = 0;
	    }
	    for(i=0; i<playerTwoProperties.length; i++){
	        groupTwo = playerTwoProperties[i].group;
	       	propertyTwoGroup[groupTwo]++;

		    if(groupTwo == "Railroad"){
	    		playerTwoProperties[i].rent = playerTwoProperties[i].rent * Math.pow(2, propertyTwoGroup[groupTwo] -1);
	    		$scope.specialMessage = true;
                $scope.message = "Player 2 will collect $" + playerTwoProperties[i].rent + " on all owned Railroads";
		    	document.getElementById(playerTwoProperties[i].position).classList.add(color + "two");
		    }
		    else if(groupTwo == "Utility"){
		    	var multiplier = (propertyTwoGroup[groupTwo]==1) ? 4 : 10;
		    	playerTwoProperties[i].rent = $scope.diceTotal * multiplier;
		    	$scope.specialMessage = true;
                $scope.message = " Rent is now  " + multiplier + " times amount shown on dice";
		    	document.getElementById(playerTwoProperties[i].position).classList.add(color + "two");
			}else{
				$scope.message = '';
			}
	    }
	    if((propertyTwoGroup[color] == byGroup[color]) && (groupTwo != "Utility") && (groupTwo != "Railroad")){
	    	for (var i = 0; i <playerTwoProperties.length; i++){
	    		if(playerTwoProperties[i].group == color){
	    			playerTwoProperties[i].rent = playerTwoProperties[i].rent * 2;
	    			$scope.specialMessage = true;
	    			$scope.message = " Player 2 now has a Monopoly! Rent is doubled!";
	    			document.getElementById(playerTwoProperties[i].position).classList.add(color + "two");
	    		}
	    	}
	    }
	}
}



	var utilityFunction = function(){
		$scope.utilityChanceInfo = true;
		utilityChance = false;
	}

	$scope.utilityRoll = function(){
		var diceThrow = (Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1));
		var utilityPaymentTotal = diceThrow * 10;
		$scope.diceThrow = "You rolled a " + diceThrow + " and must now pay " + utilityPaymentTotal;
		if(playerOneTurn){
			playerTwoBank -= utilityPaymentTotal;
			playerOneBank += utilityPaymentTotal;
		}else{
			playerTwoBank += utilityPaymentTotal;
			playerOneBank -= utilityPaymentTotal;
		}
		$scope.playerOneBank = playerOneBank;
		$scope.playerTwoBank = playerTwoBank;
	}
});

myApp.controller('infoController',function($scope, $http,$location){
	$scope.message = "HELLOOOOO";
});