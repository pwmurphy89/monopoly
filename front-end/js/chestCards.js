var chestCards = [
{name: "doctor", message: 'Pay Doctor Fees of $50', image: 'doctor.png'},
{name: "bank", message: 'Bank Error, Collect $75', image: 'bank.png' },
{name: "inherit", message: 'You inherit $100', image: 'inherit.png'},
{name: "school", message: 'Pay School Fees of $75', image: 'school.png'},
{name: "holiday", message: 'Christmas Fund Matures, Collect $100', image: 'holiday.png'}
];


var chestCard = function(player, position){
	var player = player;
	var position = position;
	var randomChestCard = chestCards[Math.floor(Math.random() * 5)];
	// var randomChestCard = chestCards[3];
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

//  Community Chest list: 

// Advance to Go (Collect $200) 
// Bank error in your favor – collect $75 
// Doctor's fees – Pay $50 
// Get out of jail free – this card may be kept until needed, or sold 
// Go to jail – go directly to jail – Do not pass Go, do not collect $200 
// It is your birthday Collect $10 from each player 
// Grand Opera Night – collect $50 from every player for opening night seats 
// Income Tax refund – collect $20 
// Life Insurance Matures – collect $100 
// Pay Hospital Fees of $100 
// Pay School Fees of $50 
// Receive $25 Consultancy Fee 
// You are assessed for street repairs – $40 per house, $115 per hotel 
// You have won second prize in a beauty contest– collect $10 
// You inherit $100 
// From sale of stock you get $50 
// Holiday Fund matures - Receive $100 