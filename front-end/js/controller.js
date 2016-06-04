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
	$scope.message = "HELLOOOOO";
});
myApp.controller('infoController',function($scope, $http,$location){
	$scope.message = "HELLOOOOO";
});