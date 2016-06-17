var chestCards = [
{name: "doctor", message: 'Pay Doctor Fees of $50', image: 'doctor.png'},
{name: "bank", message: 'Bank Error, Collect $75', image: 'bank.png' },
{name: "inherit", message: 'You inherit $100', image: 'inherit.png'},
{name: "school", message: 'Pay School Fees of $75', image: 'school.png'},
{name: "holiday", message: 'Christmas Fund Matures, Collect $100', image: 'holiday.png'},
{name: 'insurance', message: 'Life Insurnace Matures. Collect $100, image: life.png'},
{name: "gotojail", message: 'Go to Jail. Do not pass GO.', image: 'gotojail.png'},
{name: "go", message: 'Advance to GO! Collect $200!', image:'go.png'},
{name: "opera", message: 'Grand Opera Opening! Collect $50 from every player!', image:'opera.png'},
{name: "jailfree", message: 'Get Out of Jail Free!', image:'jailfree.png'}
];

var chestCard = function(player, position){
	var player = player;
	var position = position;
	// var randomChestCard = chestCards[Math.floor(Math.random() * 5)];
	var randomChestCard = chestCards[9];
	if(randomChestCard.name == "doctor"){
		doctor(player);
	}
	if(randomChestCard.name == "bank"){
		bank(player);
	}
	if(randomChestCard.name == "inherit"){
		inherit(player);
	}
	if(randomChestCard.name == "school"){
		school(player);
	}
	if(randomChestCard.name == "holiday"){
		holiday(player);
	}
	if(randomChestCard.name == "insurance"){
		insurance(player);
	}
	if(randomChestCard.name == "gotojail"){
		gotojail(player);
	}
	if(randomChestCard.name == "go"){
		go(player);
	}
	if(randomChestCard.name == "opera"){
		opera(player);
	}
	if(randomChestCard.name == "jailfree"){
		jailFree(player);
	}
	window.message = randomChestCard.message;
	window.chestImage = randomChestCard.image;

}

var doctor = function(player){
	if(player == 1){
		window.playerOneBank -= 50;
	 }else if(player == 2){
	 	window.playerTwoBank -= 50;
	 }
	window.freeParkingBank += 50;
}

var bank = function(player){
	if(player == 1){
		window.playerOneBank += 75;
	 }else if(player == 2){
	 	window.playerTwoBank += 75;
	 }
}
var inherit = function(player){
	if(player == 1){
		window.playerOneBank += 100;
	 }else if(player == 2){
	 	window.playerTwoBank += 100;
	 }
}

var school = function(player){
	if(player == 1){
		window.playerOneBank -= 75;
	 }else if(player == 2){
	 	window.playerTwoBank -= 75;
	 }
	 window.freeParkingBank += 75;
}
var holiday = function(player){
	if(player == 1){
		window.playerOneBank += 100;
	 }else if(player == 2){
	 	window.playerTwoBank += 100;
	 }
}

var insurance = function(player){
	if(player == 1){
		window.playerOneBank += 100;
	 }else if(player == 2){
	 	window.playerTwoBank += 100;
	 }
}
var gotojail = function(player){
	if(player == 1){
		window.playerOneInJail = true;
		movePiece(1, 10);
	}else if(player == 2){
		window.playerTwoInJail = true;
		movePiece(2, 10);
	}
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
var opera = function(player){
	if(player == 1){
		window.playerOneBank += 50;
		window.playerTwoBank -= 50;
	}else{
		window.playerTwoBank += 50;
		window.playerOneBank -= 50;
	}
}

var jailFree = function(player){
	if(player == 1){
		window.jailFreeOne = true;
	}else{
		window.jailFreeTwo = true;
	}
}