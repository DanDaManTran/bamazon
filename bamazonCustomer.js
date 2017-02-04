'use strict';
//stuff that is required
const inquirer = require("inquirer");
const mysql = require("mysql");
const kee = require("./key.js");

//creating access way to connect to mysql
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: kee.key,
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

//displaying the list a customer can purchase from the data base and then it would trigger the questions function with the idArray
function display () {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;

    var idArray = [];

    for(var i=0; i<res.length; i++){
      idArray.push(res[i].item_id);

      console.log(idString(res[i].item_id) + " |  " + nameString(res[i].product_name) + "|  " + "Price: " + res[i].price.toFixed(2));
      console.log("-----------------------------------------------------------------------------");
    }

    question(idArray);
  });
};

//this function will check if the user ID input matches with any of the ID in the array to make sure they are making a valid purchase
function idCheck (id, arrayId){
  var checker = false;

  for(var i = 0; i<arrayId.length; i++){
    if(arrayId[i] === id){
      checker = true;
    }
  }

  return checker;
};

//function to ask buyers questions and then sending it into posting function
function question(array){
  inquirer.prompt([
    {
      type: "input",
      name: "itemID",
      message: "What is the ID of the item you want to purchase?",
      validate: function (input) {
        var done = this.async();

        setTimeout(function () {
          if (isNaN(input) || !input || input<0) {
            done('You need to provide a number');
            return;
          } else if(!idCheck(parseInt(input), array)){
            done('You need to provide an ID on the list');
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
          if (isNaN(input) || !input || input<0) {
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
    connection.query("SELECT stock_quantity, product_name, price,total_sales, department_name FROM products WHERE ?",{item_id: ID} , function(err, res){
      if(err) throw err;

      let newStock = res[0].stock_quantity - quant;
      let newProfit = res[0].total_sales + total(res[0].price, quant);

      if(res[0].stock_quantity<quant){
        console.log("Insufficient quantity!");
        connection.end();
      } else if(res[0].stock_quantity===parseInt(quant)){
        console.log("Lucky You. You just bought the last " + res[0].product_name + ". Have Fun!");
        updatePurchase(ID, res[0].department_name, 0, newProfit, total(res[0].price, quant));
        console.log("Your total is " + total(res[0].price, quant));
      } else if(res[0].stock_quantity>quant){
        console.log("Nice purchase! " + res[0].product_name + " is super fun!");
        updatePurchase(ID, res[0].department_name, newStock, newProfit, total(res[0].price, quant));
        console.log("Your total is " + total(res[0].price, quant));
      }
    });
};

//it will caculate the total price
function total(price, count){
  return price*count;
};

//it will update the DB after the purchase
function updatePurchase(ID ,depart, quant, storeProfit, sale){
  connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: quant}, {item_id: ID}], function(err, res) {if(err) throw err;});
  connection.query("UPDATE products SET ? WHERE ?", [{total_sales: storeProfit}, {item_id: ID}], function(err, res) {if(err) throw err;});
  connection.query("SELECT total_sales FROM departments WHERE ?",{department_name: depart}, function(err, res){

    var newDProfit = sale + res[0].total_sales;

    connection.query("UPDATE departments SET ? WHERE ?", [{total_sales: newDProfit}, {department_name: depart}], function(err, res) {if(err) throw err;});

    connection.end();
  });
};

//starting running the app
display();
