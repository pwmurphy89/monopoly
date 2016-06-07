var chanceCards = [
{name: "go", message: 'Advance to GO! Collect $200!'},
{name: "illinois", message: 'Advance to Illinois Ave.'},
{name: "stCharles", message: 'Advance to St. Charles Place.  If you pass GO, collect $200'},
{name: "school", message: 'Pay School Fees of $75', action: +75},
{name: "holiday", message: 'Holiday Fund Matures, Collect $100', action: +100}
];

var chanceCard = function(player,position){
	var player = player;
	var position = position;
	// var randomChanceCard = chanceCards[Math.floor(Math.random() * 5)];
	var randomChanceCard = chanceCards[2];

	if(randomChanceCard.name == "go"){
		go(player);
	}
	if(randomChanceCard.name == "illinois"){
		illinois(player, position, randomChanceCard);
	}
	if(randomChanceCard.name == "stCharles"){
		stCharles(player, position, randomChanceCard);
	}
	if(randomChanceCard.name == "school"){
		school(player, position, randomChanceCard);
	}
	if(randomChanceCard.name == "holiday"){
		holiday(player, position, randomChanceCard);
	}
	window.message = randomChanceCard.message;
}

var go = function(player){
	if(player == 1){
		window.playerOneBank += 200;
		movePiece(1, 0);
	}else{
		window.playerTwoBank += 200;
		movePiece(2, 0)
	}
}
var illinois = function(player){
	var player = player;
	movePiece(player, 24);
}
var stCharles = function(player){
	if(player == 1){
		if (playerOnePosition == 7){
			movePiece(1, 11);
		}else{
			movePiece(1,11);
			window.playerOneBank += 200;
		}
	}else if (player == 2){
		if (playerTwoPosition == 7){
			movePiece(2, 11);
		}else{
			movePiece(2,11);
			window.playerTwoBank += 200;
		}
	}
}
		
var movePiece = function(player, position){
	console.log("weere moving the piece!");
	if(player == 1){
		document.getElementById(playerOnePosition).innerHTML = "";
		window.playerOnePosition = position;
		document.getElementById(playerOnePosition).innerHTML = "<img src='../css/images/token-ship.png'>";
	}else if(player == 2){
		document.getElementById(playerTwoPosition).innerHTML = "";
		window.playerTwoPosition = position;
		document.getElementById(playerTwoPosition).innerHTML = "<img src='../css/images/token-car.png'>";
	}
}


// Chance list: 


// Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown. 
// Advance token to the nearest Railroad and pay owner twice the rental to which he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank. (There are two of these.) 
// Advance to St. Charles Place – if you pass Go, collect $200 
// Bank pays you dividend of $50 
// Get out of Jail free – this card may be kept until needed, or traded/sold 
// Go back 3 spaces 
// Go directly to Jail – do not pass Go, do not collect $200 
// Make general repairs on all your property – for each house pay $25 – for each hotel $100 
// Pay poor tax of $15 
// Take a trip to Reading Railroad – if you pass Go collect $200 
// Take a walk on the Boardwalk – advance token to Boardwalk 
// You have been elected chairman of the board – pay each player $50 
// Your building loan matures – collect $150 
// You have won a crossword competition - collect $100
