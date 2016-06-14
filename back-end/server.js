var http = require('http');
var server = http.createServer(function(req,res){

});
server.listen(3001);
console.log("Listening on 3001");
var io = require('socket.io').listen(server);

playerOneBank = 2000;
playerTwoBank = 2000;
playerOneTurn = true;
playerTwoTurn = false;
playerOnePosition = 0;
playerTwoPosition = 0;
playerTwoOldPosition = 0;
playerOneOldPosition = 0;
playerOneInJail = false;
playerTwoInJail = false;
price = 0;
io.sockets.on('connect', function(socket){
	console.log('someone connected...');

	socket.on('dice_to_server', function(data){
		dice1 = Math.floor(Math.random() * 6 + 1);
		imageName1 = "css/images/d" + dice1 + ".gif";
		dice2 = Math.floor(Math.random() * 6 + 1);
		imageName2 = "css/images/d" + dice2 + ".gif";
		diceTotal = dice1 + dice2;

		if(playerOneInJail || playerTwoInJail){
			// jailFunction();
		}else{
			updatePosition();
		}
		io.sockets.emit('dice_to_client',{
			dice1: dice1,
			dice2: dice2,
			diceTotal: diceTotal,
			imageName1: imageName1,
			imageName2: imageName2,
			playerOnePosition: playerOnePosition,
			playerTwoPosition: playerTwoPosition,
			playerOneBank: playerOneBank,
			playerTwoBank: playerTwoBank,
			playerOneTurn: playerOneTurn,
			playerTwoTurn: playerTwoTurn

		});
		changePlayer();
	});

	socket.on('purchase_to_server', function(data){
		playerOneProperties = data.playerOneProperties;
		playerTwoProperties = data.playerTwoProperties;
		price = data.price;

		if(playerOneTurn){
			playerTwoBank -= price;
		}else{
			playerOneBank -= price;
		}
		io.sockets.emit('purchase_to_client',{
			playerOneProperties: playerOneProperties,
			playerTwoProperties: playerTwoProperties,
			playerOneBank: playerOneBank,
			playerTwoBank: playerTwoBank
		});
	});
});
var updatePosition = function(){
	if(playerOneTurn){
		playerOnePosition += diceTotal;
		if(playerOnePosition > 39){
			passGo();
		}
	}else{
		playerTwoPosition += diceTotal;
		if(playerTwoPosition > 39){
			passGo();
		}
	}
}

var passGo = function(player){
	if(playerOneTurn){
		playerOneBank += 200;
		playerOnePosition -= 40;
	}else{
		playerTwoBank += 200;
		playerTwoPosition -= 40;
	}
}
var changePlayer = function(){
	if(playerOneTurn){
		playerOneTurn = false;
		playerTwoTurn = true;
	}else{
		playerOneTurn = true;
		playerTwoTurn = false;
	}
}



