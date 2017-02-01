'use strict';
//stuff that is required
const inquirer = require("inquirer");
const mysql = require("mysql");

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

//creating enough spaces so it can display in the console beautifully
function idString(id){
	let idInput = "| " + id;

	while(idInput.length<16){
		idInput = idInput + " ";
	}

	return idInput;
};

//creating enough spaces so it can display in the console beautifully
function string18(name){
	let nameInput = "| " + name;

	while(nameInput.length<18){
		nameInput = nameInput + " ";
	}

	return nameInput;
};

//creating enough spaces so it can display in the console beautifully
function string15(name){
	let nameInput = "| " + name;

	while(nameInput.length<16){
		nameInput = nameInput + " ";
	}

	return nameInput;
};

//creating enough spaces so it can display in the console beautifully
function string14(name){
	let nameInput = "| " + name;

	while(nameInput.length<15){
		nameInput = nameInput + " ";
	}

	return nameInput;
};

//display the data base soo it can show sales stuff in each department
function display(){
	connection.query("SELECT * FROM departments", function(err, res) {
	    if(err) throw err;


	    console.log("| department_id | department_name | over_head_costs | product_sales | total_profit |");
	    console.log("|---------------|-----------------|-----------------|---------------|--------------|");

	    for(var i=0; i<res.length; i++){
	    	var total = res[i].total_sales - res[i].over_head_costs;

	    	console.log(idString(res[i].department_id) + string18(res[i].department_name) + string18(res[i].over_head_costs) + string15(res[i].total_sales) + string14(total) + "|");
    	}

    	connection.end()
    });
};

//consturtor so we can create a new department when every the Supervisor want to create one
function NewDep (name, over){
	if(!this instanceof NewDep){
		return new NewDep(name, over);
	}

	this.department_name = name;
	this.over_head_costs = over;
	this.total_sales = 0;
};

//creating a new department in our data base from the pushProduct which is our consturtor
function newDeparment (pushProduct){
	connection.query("INSERT INTO departments SET ?", pushProduct, function(err, res) {
      	if(err) throw err;

      	console.log("Congrats!! You have a new department.");
    });

	connection.end();
};

//this will ask a series of questions depending on the user input it will do either display the table or create new department
inquirer.prompt([
	{
		type: "list",
		name: "menu",
		message: "What do you want to do?",
		choices: ["View Product Sales by Department", "Create New Department"]
	}
	, {
		type: "input",
		name: "newDep",
		message: "What is the department you want to create?",
		when: function(answers){
			return answers.menu === "Create New Department";
		},
		validate: function (input) {
			var done = this.async();

			setTimeout(function () {
				if (!input) {
					done('You need enter a name');
					return;
				} 
				done(null, true);
			}, 3000);
		}
	}
	, {
		type: "input",
		name: "newOverhead",
		message: "What is this department over head costs?",
		when: function(answers){
			return answers.menu === "Create New Department";
		},
		validate: function (input) {
			var done = this.async();

			setTimeout(function () {
				if (isNaN(input) || !input || input<0) {
					done('You need to provide a number');
					return;
				} 
				done(null, true);
			}, 3000);
		}
	}
]).then(function(user) {

	if(user.menu === "View Product Sales by Department"){
		display();
	} else if(user.menu === "Create New Department"){
		newDeparment(new NewDep(user.newDep, user.newOverhead));
	}
});