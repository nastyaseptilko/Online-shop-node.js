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

SELECT * FROM Clients WHERE (Email='nastya@mail.ru') AND (Password='password')

--delete from Clients where First_Name='dddd';

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
('For Men', 'Джемпер ANTIGUA', 69.80, 'РАЗМЕРЫ: S, L, XL, XXL; Джемпер выполнен из плотного текстиля, хлопковая подкладка. ДЕТАЛИ: прямой крой, застежка на пуховице, трикотажные манжеты; СОСТАВ: Акрил - 100%'),
('For Men', 'Джемпер Jack & Jones', 119.10, 'РАЗМЕРЫ: L, XL, XXL, XXXL; Джемпер выполнен из плотного текстиля, хлопковая подкладка. ДЕТАЛИ: прямой крой, застежка на пуховице, трикотажные манжеты; СОСТАВ: Лен - 55%, Хлопок - 45%')



('For Women', 'Костюм', 235.90, ' РАЗМЕРЫ: XS, S, L, XL, XL2; ДЛИНА ИЗДЕЛИЯ ПО СПИНКЕ:170.0см.; ДЛИНА БРЮК ОТ ТАЛИИ:100.0см.; СОСТАВ:5% эластан / 75% хлопок / 20% тиар; ЦВЕТ: бежевый; ПОКРОЙ: свободный, ТИП ТКАНИ: кашемир')
('For Women', 'Cross', 169.99, 'Very beautiful Cross for women.')
('For Men', 'Jacket-TG', 139.99, 'Very beautiful jacket for men.'),

SELECT * FROM Products;
SELECT pr.Product_id, pr.Description, im.Url FROM Products pr JOIN Image im on pr.Product_id = im.Product_id WHERE Category = 'For Women' 

SELECT pr.Product_id, pr.Description, im.Url FROM Products pr RIGHT JOIN Image im on im.Product_Id = pr.Product_id 



SELECT * FROM Products WHERE Category = 'For Women';
SELECT * FROM Products WHERE Product_id = 1

SELECT pr.Product_id, pr.Price, img.Url
FROM Products pr
CROSS APPLY
(
	SELECT TOP 1 im.Url
	FROM Image im
	WHERE im.Product_id = pr.Product_id
) img WHERE Category = 'For Women' 


SELECT pr.Product_id, pr.Description, im.Url
FROM Products pr
JOIN Image im
ON im.Image_Id =
(
    SELECT TOP 1 Image_Id 
    FROM Image
    WHERE Product_id = pr.Product_id
) WHERE pr.Category = 'For Women' 



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
('true', DEFAULT, 4, 8, null);
SELECT * FROM ProductItems WHERE Liked=1 AND Client_Id=1 ;


select pr.Product_id, pr.Name, pr.Price, pr.Description,
  ProductItems.Client_Id, 
  im.Url
from Products pr
left join ProductItems on pr.Product_id = ProductItems.Product_id
left join Image im on im.Image_Id =(
    SELECT TOP 1 Image_Id 
    FROM Image
    WHERE Product_id = pr.Product_id
) WHERE ProductItems.Client_Id = 1 AND ProductItems.Liked = 1


SELECT pr.Product_id, pr.Description, im.Url
FROM Products pr
JOIN Image im
ON im.Image_Id =
(
    SELECT TOP 1 Image_Id 
    FROM Image
    WHERE Product_id = pr.Product_id
) WHERE pr.Category = 'For Women' 


SELECT * FROM Image;




--drop table Image;

create table Image(
	Image_Id int not null identity(1, 1) primary key,
	Product_Id int not null foreign key references Products(Product_Id),
	Url varchar(150)
);

SELECT * FROM Image WHERE Product_Id =1 ;
SELECT Url  FROM Image  where  Product_Id =1 ;
delete from Image where Product_Id=11;

INSERT INTO Image(Product_Id, Url) VALUES
(3, '/img/children/c1.jpg'),
(3, '/img/children/c2.jpg'),
(3, '/img/children/c3.jpg'),
(3, '/img/children/c4.jpg'),
(3, '/img/children/c5.jpg'),
(3, '/img/children/c6.jpg'),
(3, '/img/children/c7.jpg'),
(3, '/img/children/c8.jpg');


INSERT INTO Image(Product_Id, Url) VALUES
(19, '/img/men/m40.jpg'),
(19, '/img/men/m41.jpg'),
(20, '/img/men/m42.jpg'),
(20, '/img/men/m43.jpg')

(10, '/img/men/m16.jpg'),
(10, '/img/men/m17.jpg'),
(10, '/img/men/m18.jpg')


(4, '/img/women/w8.jpg'),
(5, '/img/women/w2.jpg'),
(2, '/img/men/m7.jpg'),
(3, '/img/children/c8.jpg')


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
