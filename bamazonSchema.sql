CREATE DATABASE testing;

USE testing;

CREATE TABLE IF NOT EXISTS products (
	item_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(45),
    price DECIMAL(7,2) NOT NULL,
    stock_quantity INT(10) UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
	department_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT(11) NOT NULL DEFAULT 0,
    total_sales INT(11) NOT NULL DEFAULT 0
);

Alter TABLE products ADD column total_sales int(11) not null default 0;
