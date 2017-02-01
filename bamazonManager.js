'use strict';
//stuff that is required
const inquirer = require("inquirer");
const mysql = require("mysql");
var idArray = [];
var depArray = [];

//creating access way to connect to mysql
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "whatpassword",
  database: "Bamazon"
});

//connecting to the database
connection.connect(function(err) {
  if (err) throw err;
});

//creating an ID array for validation
connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;

    for(var i=0; i<res.length; i++){
      	idArray.push(res[i].item_id);
    }
});

//creating a list of deparments for the list inquirer
connection.query("SELECT * FROM departments", function(err, res) {
    if(err) throw err;

    for(var i=0; i<res.length; i++){
      	depArray.push(res[i].department_name);
    }
});

//adding spacing to the string so it can create a table in the console
function idString (id){
  let idInput = "ID: "+ id;
  while(idInput.length<6){
    idInput = idInput + " ";
  }

  return idInput;
};

//adding spacing to the string so it can create a table in the console
function nameString (name){
	let nameInput = "Item: " + name;
	while(nameInput.length<35){
  		nameInput = nameInput + " ";
	}

	return nameInput;
};

//adding spacing to the string so it can create a table in the console
function priceString (price){
	let priceInput = "Price: " + price;
	while(priceInput.length<12){
		priceInput = priceInput + " ";
	}

	return priceInput;
};

//this function will check if the user ID input matches with any of the ID in the array to make sure they are making a valid purchase
function idChecking(inputID) { 
  	var checker = false;

  	for(var i = 0; i<idArray.length; i++){
    	if(idArray[i] === inputID){
    	  	checker = true;
    	}
  	}

	return checker;
};

//displaying the inventory list for that manager
function display () {
	connection.query("SELECT * FROM products", function(err, res) {
		if(err) throw err;

		for(var i=0; i<res.length; i++){
			console.log(idString(res[i].item_id) + " | " + nameString(res[i].product_name) + " | " + priceString(res[i].price.toFixed(2)) + " | " + "Quantity: " + res[i].stock_quantity);
			console.log("-----------------------------------------------------------------------------");
		}

		connection.end();
	});
};

//this function will display any items that is lower then 5 stock items
function gettingLow (){
	connection.query("SELECT item_id, product_name FROM products WHERE stock_quantity BETWEEN 0 AND 5", function(err, res){
		if(err) throw err;

		for(var i=0; i<res.length; i++){
			console.log(idString(res[i].item_id) + " | " + nameString(res[i].product_name));
			console.log("------------------------------------");
	    }

	    connection.end();
	});
};

//this function will find the ID manager want to order more items for and it will update the database accordingly
function addInven (ID){
	connection.query("SELECT stock_quantity, product_name FROM products WHERE ?", {item_id: ID}, function(err, res){
		if(err) throw err;

		let newStock = res[0].stock_quantity + 20;

		updateOrder(ID, newStock);

		console.log("You have ordered 20 more " + res[0].product_name + " for your stock.");

		connection.end();
	});
};

//this will update the data base that we just ordered 20 more of what ever product that is needed to be added
function updateOrder (ID, quant){
	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: quant}, {item_id: ID}], function(err, res) {
		if(err) throw err;
	});
};

//consturter to create a new product for sell in the store. 
function ProductInfo(name, department, price, stock){
	if(!(this instanceof ProductInfo)){
		return new ProductInfo(name, department, price, stock);
	}

	this.product_name = name;
	this.department_name = department;
	this.price = price;
	this.stock_quantity = stock;
};

//creating a new product line in the database depending on the inputs of the manager
function newProduct (pushProduct){
	connection.query("INSERT INTO products SET ?", pushProduct, function(err, res) {
      	if(err) throw err;

      	console.log("Congrats!! Your item have been posted.");
    });

	connection.end();
};

//questioning the manager for what they want to do then depending on the inputs we will do a switch case and trigger what is needed to be trigger
inquirer.prompt([
	{
		type: "list",
		name: "menu",
		message: "What do you want to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}
	, {
		type: "input",
		name: "idInput",
		message: "What is the ID of the item you want to order more?",
		when: function(answers){
			return answers.menu === "Add to Inventory";
		},
		validate: function (input) {
			var done = this.async();

			setTimeout(function () {
				if (isNaN(input)) {
					done('You need to provide a number');
					return;
				} else if(!idChecking(parseInt(input))){
					done('You need to provide an ID on the list');
					return;
				}
				done(null, true);
			}, 3000);
		}
	}
	, {
		type: "input",
		name: "newName",
		message: "What is the name of this new product?",
		when: function(answers){
			return answers.menu === "Add New Product";
		},
		validate: function (input) {
			var done = this.async();

			setTimeout(function () {
				if (!input) {
					done('Please input a name of the product');
					return;
				} 
				done(null, true);
			}, 3000);
		}
	}
	, {
		type: "list",
		name: "newDep",
		message: "What deparment does this new product belong in?",
		choices: depArray,
		when: function(answers){
			return answers.menu === "Add New Product";
		},
		validate: function (input) {
			var done = this.async();

			setTimeout(function () {
				if (!input) {
					done('Please input a deparment');
					return;
				} 
				done(null, true);
			}, 3000);
		}
	}
	, {
		type: "input",
		name: "newPrice",
		message: "How much will you be selling this product for?",
		when: function(answers){
			return answers.menu === "Add New Product";
		},
		validate: function (input) {
			var done = this.async();

			setTimeout(function () {
				if (isNaN(input) || !input) {
					done('Please input a price');
					return;
				} 
				done(null, true);
			}, 3000);
		}
	}
	, {
		type: "input",
		name: "newStock",
		message: "How much will you be ready to stock for this product?",
		when: function(answers){
			return answers.menu === "Add New Product";
		},
		validate: function (input) {
			var done = this.async();

			setTimeout(function () {
				if (isNaN(input) || !input) {
					done('Please input a quantity');
					return;
				} 
				done(null, true);
			}, 3000);
		}
	}
]).then(function(user) {

	switch(user.menu){
		case "View Products for Sale":
			display();
			break;
		case "View Low Inventory":
			gettingLow();
			break;
		case "Add to Inventory":
			addInven(user.idInput);
			break;
		case "Add New Product":
			newProduct(new ProductInfo(user.newName, user.newDep, user.newPrice, user.newStock));
			break;
	};
});



