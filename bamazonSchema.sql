CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE IF NOT EXISTS departments (
	department_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT(11) NOT NULL DEFAULT 0,
    total_sales INT(11) NOT NULL DEFAULT 0
);

INSERT INTO departments (department_name, over_head_costs, total_sales)
VALUES ('Board Games', 100, 0)
, ('Electronics', 3000, 0)
, ('Misc.', 200, 0)
, ('Home Goods', 200, 0)
, ('Sports', 500, 0)
, ('Toys', 150, 0);

Alter TABLE products ADD column total_sales int(11) not null default 0;
