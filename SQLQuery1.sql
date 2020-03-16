use master;
 create database QDEW_BD;
 use QDEW_BD;
 
create table Clients( 
Client_Id int not null,
First_Name nvarchar(50) not null,
Last_Name nvarchar(50) not null,
email nvarchar(50) not null,
password nvarchar(50) not null,
BirthDay Date ,
Country nvarchar(50) ,
City nvarchar(50) ,
Postcode int not null,
Phone_number int , 
constraint Client_PK primary key(Client_Id))

create table Products(
Produc_Id int not null,
Client_Id int not null,
Category_Id int not null,
Order_Detail_Id int not null,
Name  nvarchar(50) not null,
Prace float not null,
Count_All int not null,
Count_Active int not null,
constraint Produc_PK primary key(Produc_Id))

drop table Products

create table Order_Details(
Order_Detail_Id int not null,
Prace float not null,
Count_Products int not null,
Bonus float ,
constraint Order_Detail_PK primary key(Order_Detail_Id))

create table Categories(
Category_Id int not null,
Name nvarchar(100) not null,
Discription  nvarchar(200) not null,
Image image ,
constraint Category_PK primary key(Category_Id))

create table Orders(
Order_Id int not null , 
Client_Id int not null,
Date_Order Date not null,
Date_Send Date not null,
Sending_Option nvarchar(50) not null,
Bonus float,
Country nvarchar(50) not null,
City nvarchar(50) not null,
Adress nvarchar(100) not null,
Postcode int not null,
constraint Order_PK primary key(Order_Id))

create table Saved_Products(
Basket_Id int not null,
Product_Id int not null,
constraint Basket_PK primary key(Basket_Id))


create table Favorite(
Like_Id int not null,
Basket_Id int not null,
Product_Id int not null,
constraint Like_PK primary key(Like_Id))
