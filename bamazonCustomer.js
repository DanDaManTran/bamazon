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
function idString(id){
  let idInput = "ID: "+ id;
  while(idInput.length<6){
    idInput = idInput + " ";
  }

  return idInput;
};

//adding spacing to the string so it can create a table in the console
function nameString(name){
  let nameInput = "Item: " + name;
  while(nameInput.length<40){
    nameInput = nameInput + " ";
  }

  return nameInput;
};

//displaying the list a customer can purchase from the data base 
function display () {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;

    for(var i=0; i<res.length; i++){
      console.log(idString(res[i].item_id) + " |  " + nameString(res[i].product_name) + "|  " + "Price: " + res[i].price.toFixed(2));
      console.log("-----------------------------------------------------------------------------");
    }

    question();
  });
};

//function to ask buyers questions and then sending it into posting function
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

    checking(user.itemID, user.quantity);

  });
};

//it will check if there are enough in the inventory before it do anything else. then it would console.log the status and update purchase when needed
function checking (ID, quant){
    connection.query("SELECT stock_quantity, product_name, price FROM products WHERE ?",{item_id: ID} , function(err, res){
      if(err) throw err;

      var newStock = res[0].stock_quantity - quant;

      if(res[0].stock_quantity<quant){
        console.log("Insufficient quantity!");
        connection.end();
      } else if(res[0].stock_quantity===parseInt(quant)){
        console.log("Lucky You. You just bought the last " + res[0].product_name + ". Have Fun!");
        updatePurchase(ID, 0);
        total(res[0].price, quant);
        connection.end();
      } else if(res[0].stock_quantity>quant){
        console.log("Nice purchase! " + res[0].product_name + " is super fun!");
        updatePurchase(ID, newStock);
        total(res[0].price, quant);
        connection.end();
      }
    });
};

//it will caculate the total price
function total(price, count){
  console.log("Your total is " + price*count);
};

//it will update the DB after the purchase
function updatePurchase(ID, quant){
  connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: quant}, {item_id: ID}], function(err, res) {});
};

//starting running the app
display();


