use master;
create database QDEW_BD;

use QDEW_BD;
 
--drop table Clients;

create table Clients(
	Client_Id int not null identity(1,1) primary key,
	First_Name nvarchar(50) not null,
	Last_Name nvarchar(50) not null,
	Phone_number nvarchar(20) not null,
	Email nvarchar(50) not null unique,
	Password nvarchar(255) not null,
	BirthDay date,
	Country nvarchar(50),
	City nvarchar(50),
	Street nvarchar(70),
	Postcode int
);

INSERT INTO Clients(First_Name, Last_Name, Phone_number, Email, Password) VALUES
('Nastya', 'Septilko', '375333212979', 'nastya@mail.ru', 'password'),
('Ilya', 'Matsuev', '375292033067', 'ilya@mail.ru', 'password');
SELECT * FROM Clients;



--drop table Categories;

create table Categories(
	Name nvarchar(20) not null primary key
);

INSERT INTO Categories VALUES
('For Women'), ('For Men'), ('For Children');
SELECT * FROM Categories;



--drop table Products;

create table Products(
	Product_Id int not null identity(1, 1) primary key,
	Category nvarchar(20) not null foreign key references Categories(Name),
	Name nvarchar(50) not null,
	Price float not null,
	Description text,
	Discount float
);

INSERT INTO Products(Category, Name, Price, Description) VALUES
('For Women', 'Jacket', 169.99, 'Very beautiful jacket for women.'),
('For Men', 'Jacket-TG', 139.99, 'Very beautiful jacket for men.');
SELECT * FROM Products;




--drop table ProductItems;

create table ProductItems(
	ProductItem_Id int not null identity(1, 1) primary key,
	Liked bit default 0,
	Added bit default 0,
	Client_Id int not null foreign key references Clients(Client_Id),
	Product_Id int foreign key references Products(Product_Id),
	Order_Id int foreign key references Orders(Order_Id)
);

INSERT INTO ProductItems(Liked, Added, Client_Id, Product_Id, Order_Id) VALUES
(DEFAULT, DEFAULT, 1, 1, 1), (1, 1, 1, 2, null), (1, DEFAULT, 2, 2, null);
SELECT * FROM ProductItems;




--drop table Image;

create table Image(
	Image_Id int not null identity(1, 1) primary key,
	Product_Id int not null foreign key references Products(Product_Id),
	Url varchar(150)
);

INSERT INTO Image(Product_Id, Url) VALUES
(1, '/img/8.jpg'),
(1, '/img/15.jpg'),
(2, '/img/14.jpg');
SELECT * FROM Image;




--drop table Orders;

create table Orders(
	Order_Id int not null identity(1, 1) primary key,
	Client_Id int not null foreign key references Clients(Client_Id),
	Order_Date date not null default GETDATE(),
	Country nvarchar(50) not null,
	City nvarchar(50) not null,
	Street nvarchar(70) not null,
	Postcode int not null,
	Price float not null,
	Comment text
);

INSERT INTO Orders(Client_Id, Order_Date, Country, City, Street, Postcode, Price) VALUES
(1, DEFAULT, 'Belarus', 'Minsk', 'Belarusskaya 21', 202020, 169.99);
SELECT * FROM Orders;
