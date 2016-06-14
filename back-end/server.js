var http = require('http');
var server = http.createServer(function(req,res){

});
server.listen(3001);
console.log("Listening on 3001");
var io = require('socket.io').listen(server);

playerOneBank = 2000;
playerTwoBank = 2000;
freeParkingBank = 200;
playerOneTurn = true;
playerTwoTurn = false;
playerOnePosition = 0;
playerTwoPosition = 0;
playerOneInJail = false;
playerTwoInJail = false;
jailFreeOne = false;
jailFreeTwo = false;
playerOneCounter = 1;
playerTwoCounter = 1;
price = 0;
message = '';

io.sockets.on('connect', function(socket){
	console.log('someone connected...');

	socket.on('dice_to_server', function(data){
		dice1 = Math.floor(Math.random() * 6 + 1);
		imageName1 = "css/images/d" + dice1 + ".gif";
		dice2 = Math.floor(Math.random() * 6 + 1);
		imageName2 = "css/images/d" + dice2 + ".gif";
		diceTotal = 3;

		if((playerOneInJail && playerTwoTurn) || (playerTwoInJail && playerOneTurn)){
			jailFunction();
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
			playerTwoTurn: playerTwoTurn,
			playerOneInJail: playerOneInJail,
			playerTwoInJail: playerTwoInJail,
			jailFreeOne: jailFreeOne,
			jailFreeTwo : jailFreeTwo

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

	socket.on('notPurchase_to_server', function(data){
		io.sockets.emit('notPurchase_to_client',{
		});
	});

	socket.on('rent_to_server', function(data){
		if(playerOneTurn){
			playerTwoBank -= data.property.rent;
			playerOneBank += data.property.rent;
		}else{
			playerOneBank -= data.property.rent;
			playerTwoBank += data.property.rent;
		}
		io.sockets.emit('rent_to_client',{
			playerOneBank: playerOneBank,
			playerTwoBank: playerTwoBank,
			rent: data.property.rent
		});
	});

	socket.on('specialSpace_to_server', function(data){
		console.log(data);
		var position = data.cell.position;
		if(position == 0){
			message = "Collect 200!";
		}
		if(position == 2 || position == 17 || position == 33){
			//chestCard(player, position);
		}
		if(position == 7 || position == 22 || position == 36){
			// chanceCard(player, position);
		}
		if(position == 4){
			incomeTax();	
		}
		if(position == 38){
			luxuryTax();
		}
		if(position == 20){
			freeParking();
		}
		if(position == 30){
			gotojail();
		}
		if(position == 10){
		}
	
		io.sockets.emit('specialSpace_to_client',{
			message: message,
			playerOneBank: playerOneBank,
			playerTwoBank: playerTwoBank,
			freeParkingBank: freeParkingBank,
			playerOnePosition: playerOnePosition,
			playerTwoPosition: playerTwoPosition,
			playerOneInJail: playerOneInJail,
			playerTwoInJail: playerTwoInJail
		});
	});

});

var gotojail = function(){
	if(playerTwoTurn){
		playerOnePosition = 10;
		playerOneInJail = true;
	}else{
		playerTwoPosition = 10;
		playerTwoInJail = true;
	}
	message = "Do not pass GO! Do not collect $200! Get out after three rolls or roll doubles.";
}

var freeParking = function(){

	if (playerTwoTurn){
		playerOneBank += freeParkingBank;

	}else{
		playerTwoBank += freeParkingBank;
	}
	freeParkingBank = 200;
	message = "Collect Free Parking Bank!";
}

var incomeTax = function(){
	if(playerTwoTurn){
		playerOneBank -= Math.floor(playerOneBank * .1);
		freeParkingBank += Math.floor(playerOneBank * .1);
	}else{
		playerTwoBank -= Math.floor(playerTwoBank * .1);
		freeParkingBank += Math.floor(playerTwoBank * .1);
	}
	message = "Income Tax: Pay 10%";
}

var luxuryTax = function(){
	if(playerTwoTurn){
		playerOneBank -= 100;
	}else{
		playerTwoBank -= 100;
	}
	freeParkingBank += 100;
	message = "Luxury Tax: Pay $100";
}

var jailFunction = function(){
	if(playerTwoTurn){
		if(jailFreeOne){
			message = "Player One has Get Out of Jail Free Card. Can leave Jail next Turn";
			playerOneInJail = false;
			jailFreeOne = false;
		}else{
			if (dice1 === dice2){
				message = "Player One rolled doubles and got out!";
				playerOneInJail = false;
				playerOneCounter = 1;
			}else{
				if(playerOneCounter == 3){
					message = "Player One has rolled three times and can leave jail next turn.";
					playerOneInJail = false;
					playerOneCounter = 1;
				}else{
					message = "Player One has rolled " + playerOneCounter + " times while in Jail"; 
					playerOneCounter += 1;
				}
			}
		}
	}else{
		if(jailFreeTwo){
			message = "Player Two has Get Out of Jail Free Card. Can leave Jail next Turn";
			playerTwoInJail = false;
			jailFreeTwo = false;
		}else{
			if(dice1 === dice2){
				message = "Player Two rolled doubles and got out!";
				playerTwoInJail = false;
				playerTwoCounter = 1;
			}else{
				if(playerTwoCounter == 3){
					message = "Player Two has rolled three times and can leave jail next turn.";
					playerTwoInJail = false;
					playerTwoCounter = 1;
				}else{
					message = "Player Two has rolled " + playerTwoCounter + " times while in Jail";
					playerTwoCounter += 1;
				}
			}
		}
	}
}

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
	if(playerTwoTurn){
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



