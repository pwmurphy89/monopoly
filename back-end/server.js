var http = require('http');
var cells = require('./models/cellData');
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
jailFreeOne = false;
jailFreeTwo = false;
price = 0;
purchaseOption = false;
position = 0;
purchaseMessage = '';
playerOneProperties = [];
playerTwoProperties = [];
rent = 0;
showRent = false;
showSpecialMessage = false;
freeParkingBank = 200;
message = '';
playerOneCounter = 1;
playerTwoCounter = 1;

io.sockets.on('connect', function(socket){
	console.log('someone connected...');

	socket.on('dice_to_server', function(data){
		dice1 = Math.floor(Math.random() * 6 + 1);
		imageName1 = "css/images/d" + dice1 + ".gif";
		dice2 = Math.floor(Math.random() * 6 + 1);
		imageName2 = "css/images/d" + dice2 + ".gif";
		diceTotal = 10;
		if((playerOneInJail && playerOneTurn) || (playerTwoInJail && playerTwoTurn)){
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
			freeParkingBank: freeParkingBank,
			playerOneTurn: playerOneTurn,
			playerTwoTurn: playerTwoTurn,
			jailFreeOne: jailFreeOne,
			jailFreeTwo: jailFreeTwo,
			purchaseOption: purchaseOption,
			property: cells[position],
			rent: rent,
			showRent: showRent,
			message: message,
			showSpecialMessage: showSpecialMessage,
		});
		if(showRent){
			changePlayer();
			showRent = false;
		}
		if(showSpecialMessage){
			changePlayer();
			showSpecialMessage = false;
		}
	});

	socket.on('purchase_to_server', function(data){
		purchaseProperty();
		io.sockets.emit('purchase_to_client',{
			playerOneProperties: playerOneProperties,
			playerTwoProperties: playerTwoProperties,
			playerOneBank: playerOneBank,
			playerTwoBank: playerTwoBank,
			playerOneTurn: playerOneTurn,
			playerTwoTurn: playerTwoTurn,
			purchaseMessage: purchaseMessage
		});
		changePlayer();
	});

	socket.on('notPurchase_to_server', function(data){
		io.sockets.emit('notPurchase_to_client',{
		});
		changePlayer();
	});

	socket.on('rent_to_server', function(data){

		io.sockets.emit('rent_to_client',{
			playerOneBank: playerOneBank,
			playerTwoBank: playerTwoBank,
			rent: data.property.rent,
		});
		changePlayer();
	});
});

var purchaseProperty = function(){
	if(playerOneTurn){
		if(playerOneBank < cells[playerOnePosition].price){
			purchaseMessage = "has insufficent funds to purchase";
		}else{
			cells[playerOnePosition].status = "owned";
			playerOneProperties.push(cells[playerOnePosition]);
			playerOneBank -= cells[playerOnePosition].price;
			purchaseMessage = " purchased ";
		}
	}else{
		if(playerTwoBank<cells[playerTwoPosition].price){
			purchaseMessage = "has insufficent funds to purchase";
		}else{
			cells[playerTwoPosition].status = "owned";
			playerTwoProperties.push(cells[playerTwoPosition]);
			playerTwoBank -= cells[playerTwoPosition].price;
			purchaseMessage = " purchased ";
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
	checkPosition();
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

var checkPosition = function(utilityChance){
	if(playerOneTurn){
		position = playerOnePosition;
	}else{
		position = playerTwoPosition;
	}
	if(cells[position].status == "vacant"){
		purchaseOption = true;
	}else if(cells[position].status == "owned"){
		purchaseOption = false;
		if(utilityChance){
			// utilityFunction();
		}else{
			payRent(position);
		}
	}else if(cells[position].status == "public"){
		purchaseOption = false;
		showSpecialMessage = true;
		specialPosition();
	}
}
var specialPosition = function(){
	if(playerOneTurn){
		position = playerOnePosition;
	}else{
		position = playerTwoPosition;
	}
	if(position == 0){
		message = "Collect $200";
	}
	if(position == 2 || position == 17 || position == 33){
		// chestCard(player, position);
		// $scope.chestImage = chestImage;
		// if(jailFreeOne){
		// 	$scope.jailFreeCardOne = true;
		// }if(jailFreeTwo){
		// 	$scope.jailFreeCardTwo = true;
		// }
	}
	if(position == 7 || position == 22 || position == 36){
		// chanceCard(player, position);
		// $scope.chanceImage = chanceImage;
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
		message = "Just visiting";
	}
	// changePlayer();
}

var jailFunction = function(){
	showSpecialMessage = true;
	if(playerOneTurn){
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

var gotojail = function(){
	if(playerOneTurn){
		playerOnePosition = 10;
		playerOneInJail = true;
	}else{
		playerTwoPosition = 10;
		playerTwoInJail = true;
	}
	message = "Do not pass GO! Do not collect $200! Get out after three rolls or roll doubles.";
}

var payRent = function(position){
	if(playerOneTurn){
		playerTwoBank += cells[position].rent;
		playerOneBank -= cells[position].rent;
	}else{
		playerOneBank += cells[position].rent;
		playerTwoBank -= cells[position].rent;
	}
	rent = cells[position].rent;
	showRent = true;
}

var incomeTax =function(position){
	if(playerOneTurn){
		freeParkingBank += Math.floor(playerOneBank * .1);
		playerOneBank -= Math.floor(playerOneBank * .1);
	}else{
		freeParkingBank += Math.floor(playerTwoBank * .1);
		playerTwoBank -= Math.floor(playerTwoBank * .1);
	}
	message = "Income Tax: Pay 10%";
}
var luxuryTax = function(){
	if(playerOneTurn){
		playerOneBank -= 100;
	}else{
		playerTwoBank -= 100;
	}
	freeParkingBank += 100;
	message = "Luxury Tax: Pay $100";
}
var freeParking = function(){
	if (playerOneTurn){
		playerOneBank += freeParkingBank;
	}else{
		playerTwoBank += freeParkingBank;
	}
	freeParkingBank = 200;
	message = "Collect Free Parking Bank!";
}


var byGroup = [];
var thisGroup;
for(i=0; i<cells.length; i++){
    thisGroup = cells[i].group;
    byGroup[thisGroup] = 0;
}
for(i=0; i<cells.length; i++){
    thisGroup = cells[i].group;
    byGroup[thisGroup]++;
}



