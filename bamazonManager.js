'use strict';
//stuff that is required
const inquirer = require("inquirer");
const mysql = require("mysql");

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

//displaying the inventory list for that manager
function display () {
	connection.query("SELECT * FROM products", function(err, res) {
		if(err) throw err;

		for(var i=0; i<res.length; i++){
			console.log(idString(res[i].item_id) + " | " + nameString(res[i].product_name) + " | " + priceString(res[i].price.toFixed(2)) + " | " + "Quantity: " + res[i].stock_quantity);
			console.log("-----------------------------------------------------------------------------");
		}

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
	});
};

//this function will find the ID manager want to order more items for and it will update the database accordingly
function addInven (ID){

	connection.query("SELECT stock_quantity, product_name FROM products WHERE ?", {item_id: ID}, function(err, res){
		if(err) throw err;

		let newStock = res[0].stock_quantity + 20;

		console.log(ID);

		updateOrder(ID, newStock);

		console.log("You have ordered 20 more " + res[0].product_name + " for your stock.");
	});
};

//WTF THIS IS NOT WORKING!!!!!!!!!
function updateOrder (ID, quant){
	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: quant}, {item_id: ID}], function(err, res) {});
};
//*********************************************

function newProduct ( ){
	connection.query("")
};

//questioning the manager for what they want to do
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
		}
	}
]).then(function(user) {

	switch(user.menu){
		case "View Products for Sale":
			display();
			connection.end();
			break;
		case "View Low Inventory":
			gettingLow();
			connection.end();
			break;
		case "Add to Inventory":
			addInven(user.idInput);
			connection.end();
			break;
	};
});



