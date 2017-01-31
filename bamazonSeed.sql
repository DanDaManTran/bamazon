USE Bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Settlers of Catan', 'Board Games', 50.00, 17)
, ('Betrayal at House on the Hill', 'Board Games', 45.00, 21)
, ('Codename', 'Board Games', 20.00, 22)
, ('Pandemic', 'Board Games', 30.00, 4)
, ('Avalon', 'Board Games', 14.00, 21)
, ('Ticket to Ride', 'Board Games', 55.99, 21)
, ('Risk', 'Board Games', 35.25, 21)
, ('Adrenaline', 'Board Games', 69.86, 21)
, ('Taboo', 'Board Games', 10.30, 2)
, ('Small World', 'Board Games', 25.40, 21)
, ('Lords of Waterdeep', 'Board Games', 40.00, 21)
, ('Splendor', 'Board Games', 22.00, 21);




INSERT INTO departments (department_name, over_head_costs, total_sales)
VALUES ('Board Games', 100, 0)
, ('Electronics', 3000, 0)
, ('Misc.', 200, 0)
, ('Home Goods', 200, 0)
, ('Sports', 500, 0)
, ('Toys', 150, 0);