#Week of 12 HW: Node.js & MySQL

This is a amazon like, but for the backend. It is a backend app where it will use a mysql database to update the data depending on which files run.

After cloning this. You will install the npm packages.

```
npm install
```

Then you would want to use the schema to create your database, and seed to input values into the table. Then you can run either of the js files to get started.

```
node bamazonCustomer.js
```
```
node bamazonManager.js
```
```
node bamazonSupervisor.js
```

In each of the js files you will need to update the connection values. 

#Customer

As a customer it will display the inventory and prompt you to make a purchase. After going through it will update the database accordingly to your purchase input.

#Manager

As a manager you get to view products for sale, view low inventory, order more items to restock, and add new products to the database.

#Supervisor

As a supervisor you can view product sales by department and create a new department.

Here is the demo of the play through of this app.

![Hello](/sampleBamazon.gif)

Here is a link to the video. [Click for video](https://drive.google.com/file/d/0B58fLOR9GyvqaGdCb3ppUC1SSW8/view)
