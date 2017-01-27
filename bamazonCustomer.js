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

//displaying the list a customer can purchase from the data base 
connection.query("SELECT * FROM products", function(err, res) {
	if(err) throw err;

  for(var i=0; i<res.length; i++){
    console.log("ID: " + res[i].item_id + " | " + "Item: " + res[i].product_name + " | " + "Price: " + res[i].price);
  }

  connection.end();
  posting(question());
});


function question(){
  inquirer.prompt([
    {
      type: "input",
      name: "itemID",
      message: "What is the ID of the item you want to purchase?",
      validate: function (input) {
        var done = this.async();
     
        setTimeout(function () {
          if (isNaN(input)) {
            done('You need to provide a number');
            return;
          }
          done(null, true);
        }, 3000);
      }
    }
    ,  {
      type: "input",
      name: "quantity",
      message: "How many do you want of this item?",
      validate: function (input) {
        var done = this.async();
     
        setTimeout(function () {
          if (isNaN(input)) {
            done('You need to provide a number');
            return;
          }
          done(null, true);
        }, 3000);
      }
    }
  ]).then(function(user) {
    return user.itemID + ", " + user.quantity;
  });
};

function posting(ID, quant){
  if(ID != undefined || quant != undefined) {
    console.log(ID + " " + quant);
    console.log("hello");
  }
};

