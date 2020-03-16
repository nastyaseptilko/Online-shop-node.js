delete database Qdew;
use Qdew2
create database Qdew;

CREATE TABLE USERS(
	[User_Id] int PRIMARY KEY IDENTITY,
	[Login] nvarchar(50) NOT NULL,
	[Password] nvarchar(30) NOT NULL,
	[City] nvarchar(30) NOT NULL
);

insert into Users(Login, Password, City) values( 'test', '123', 'Minsk');

SELECT * FROM Users WHERE (Login='sas@dqw.com') AND (Password='333')
