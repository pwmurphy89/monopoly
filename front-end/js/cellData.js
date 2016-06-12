var cells = [
	{name: "GO", position: 0, price: 0, rent: 0, group: "Go", status: "public"},
	{name: "Mediterranean Ave.", position: 1, price: 60, rent: 2, group: "Purple", status: "vacant"},
	{name: "Community Chest", position: 2, price: 0, rent: 0, group: "Chest", status: "public" },
	{name: "Baltic Ave.", position: 3, price: 60, rent: 4, group: "Purple",status: "vacant" },
	{name: "Income Tax", position: 4, price: 0, rent: 0, group: "Tax", status: "public"},
	{name: "Reading Railroad" , position: 5, price: 200, rent: 25, group: "Railroad", status: "vacant" },
	{name: "Oriental Ave." , position: 6, price: 100, rent: 6, group: "Light-Green", status: "vacant"},
	{name: "Chance", position: 7, price: 0, rent: 0, group:"Chance", status: "public"},
	{name:"Vermont Ave.", position: 8, price: 100, rent: 6, group: "Light-Green", status: "vacant"},
	{name: "Connecticut Ave.", position: 9, price: 120, rent: 8, group:"Light-Green", status: "vacant"},
	{name:"Jail", position: 10, price: 0, rent: 0, group:"Jail", status: "public"},
	{name:"St. Charles Place"  , position: 11, price: 140, rent: 10, group: "Violet", status: "vacant"},
	{name: "Electric Co" , position: 12, price: 150, rent: 25, group: "Utility", status: "vacant"},
	{name: "States Ave.", position: 13, price: 160, rent: 10, group: "Violet", status: "vacant"},
	{name: "Virginia Ave.", position: 14, price: 160, rent: 12, group: "Violet", status: "vacant"},
	{name: "Pennsylvania Railroad", position: 15, price: 150, rent: 25, group: "Railroad", status: "vacant"},
	{name:"St. James Place", position: 16, price: 180, rent: 14, group:"Orange", status: "vacant"},
	{name: "Community Chest", position: 17, price: 0, rent: 0, group: "Chest", status: "public"},
	{name: "Tennessee Ave.", position: 18, price: 180, rent:14, group:"Orange", status: "vacant"},
	{name: "New York Ave."  , position: 19, price:200, rent:18, group: "Orange", status: "vacant"},
	{name:"Free Parking", position: 20, price: 0, rent: 0, group:"Free Parking", status: "public"},
	{name: "Kentucky Ave.", position: 21, price: 220, rent: 18, group: "Red", status: "vacant"},
	{name: "Chance" , position: 22, price: 0, rent: 0, group: "Chance", status: "public"},
	{name: "Indiana Ave.", position: 23, price: 220, rent: 18, group: "Red", status: "vacant"},
	{name: "Illinois Ave.", position: 24, price: 240, rent: 20, group: "Red", status: "vacant"},
	{name: "B. & O. Railroad", position: 25, price: 150, rent: 25, group: "Railroad", status: "vacant"},
	{name: "Atlantic Ave.", position: 26, price: 260, rent: 22, group:"Yellow", status: "vacant"},
	{name: "Ventnor Ave.", position: 27, price: 260, rent: 22, group:"Yellow", status: "vacant"},
	{name: "Water Works", position: 28, price: 150, rent: 20, group:"Utility", status: "vacant"},
	{name: "Marvin Gardens", position: 29, price: 280, rent: 22, group:"Yellow", status: "vacant"},
	{name: "Go to Jail", position: 30, price: 0, rent: 0, group: "GoToJail", status: "public"},
	{name: "Pacific Ave.", position: 31, price: 300, rent: 26, group: "Dark-Green", status: "vacant"},
	{name: "North Carolina Ave.", position: 32, price: 300, rent: 26, group:"Dark-Green", status: "vacant"},
	{name: "Community Chest", position: 33, price: 0, rent: 0, group:"Chest", status: "public"},
	{name: "Pennsylvania Ave.", position: 34, price: 320, rent: 28, group:"Dark-Green", status: "vacant"},
	{name: "Short Line Railroad", position: 35, price: 150, rent: 25, group:"Railroad", status: "vacant"},
	{name: "Chance", position: 36, price: 0, rent: 0, group:"Chance", status: "public"},
	{name: "Park Place", position: 37, price: 350, rent: 35, group: "Blue", status: "vacant"},
	{name:  "Luxury Tax", position: 38, price: 0, rent: 0, group:"Tax", status: "public"},
	{name: "Boardwalk", position: 39, price: 400, rent: 50, group:"Blue", status: "vacant"}
	];
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

    console.log(byGroup);