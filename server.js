const fs = require('fs');
const url = require('url');
const express = require("express");
const expressHandlebars = require('express-handlebars');

const db = require('./model/db/db_Qdew');
const app = express();

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));


app.get("/", function (request, response) {
    response.sendFile(__dirname + "/view/new.html");
});

app.get("/login", function (request, response) {
    // response.sendFile(__dirname + "/view/logIn.html");
    response.render('login', {
        title: 'Login',
        layout: 'authorization',
        registerLink: true
    });
});
app.get("/register", function (request, response) {
    //response.sendFile(__dirname + "/view/register.html");
    response.render('register', {
        title: 'Register',
        layout: 'authorization',
        registerLink: false
    });
});
app.get("/pageForWomen", function (request, response) {
    // TODO: Взять массив продуктов с картинками из базы данных и вставить их в products
    response.render('pageForWomen', {
        title: 'For Women',
        layout: 'products',
        products: [
            {
                id: 1,
                imageUrl: '/img/10.jpg',
                description: 'Dictionary text for product'
            },
            {
                id: 2,
                imageUrl: '/img/10.jpg',
                description: 'Dictionary text for product'
            },
            {
                id: 3,
                imageUrl: '/img/10.jpg',
                description: 'Dictionary text for product'
            },
            {
                id: 4,
                imageUrl: '/img/10.jpg',
                description: 'Dictionary text for product'
            },
            {
                id: 5,
                imageUrl: '/img/10.jpg',
                description: 'Dictionary text for product'
            }
        ]
    });
    // response.sendFile(__dirname + "/view/pageForWomen.html");
});

app.get("/pageForMen", function (request, response) {
    response.sendFile(__dirname + "/view/pageForMen.html");
});

app.get("/pageForChildren", function (request, response) {
    response.sendFile(__dirname + "/view/pageForChildren.html");
});
app.get("/sale", function (request, response) {
    response.sendFile(__dirname + "/view/sale.html");
});

app.get("/likeProducts", function (request, response) {
    response.sendFile(__dirname + "/view/likeProducts.html");
});
app.get("/orders", function (request, response) {
    /*if () {
        response.redirect('/login');
    }*/

    response.sendFile(__dirname + "/view/orders.html");
});
app.post("/register", function (request, response) {
    let userInfo = request.body;
    console.log(userInfo);
    // TODO: Проверить совпадают ли пароли passwordand confirm password
    // TODO: если нет - вернуть юзеру ошибку
    if (userInfo.password !== userInfo.confirm) {
        response.render('register', {
            layout: 'authorization',
            error: 'invalid password'
        });
        return;
    }
    db.connectionPool.connect()
        .then(pool => {
            return pool.request()
                .input('email', db.sql.NVarChar, userInfo.username)
                .query(`SELECT * FROM Clients WHERE (Email=@email)`)
                .then(userResult => {
                    console.log(userInfo);
                    if (userResult.recordset.length != 0) {
                        response.render('register', {
                            layout: 'authorization',
                            errorIsUser: 'this user is in the site'
                        });
                        pool.close();
                    } else {
                        pool.request()
                            .input('first_name', db.sql.NVarChar, userInfo.firstName)
                            .input('last_name', db.sql.NVarChar, userInfo.lastName)
                            .input('phone_number', db.sql.NVarChar, userInfo.phoneNumber)
                            .input('email', db.sql.NVarChar, userInfo.username)
                            .input('password', db.sql.NVarChar, userInfo.password)
                            .input('city', db.sql.NVarChar, userInfo.city)
                            .query(`INSERT INTO Clients(First_Name, Last_Name, Phone_number, Email, Password,City) 
                            values (@first_name, @last_name, @phone_number, @email, @password, @city);`)
                            .then(userResult => {
                                response.redirect('/');
                                pool.close();
                            });
                    }
                });
        });

});

app.post("/login", function (request, response) {
    db.connectionPool.connect()
        .then(pool => {
            let userInfo = request.body;
            return pool.request()
                .input('email', db.sql.NVarChar, userInfo.username)
                .input('password', db.sql.NVarChar, userInfo.password)
                .query(`SELECT * FROM Clients WHERE (Email=@email) AND (Password=@password)`)
                .then(userResult => {
                    console.log(userInfo);
                    if (userResult.recordset.length != 0) {
                        response.redirect('/');
                    } else {
                        response.render('login', {
                            layout: 'authorization',
                            error: 'invalid username or password'
                        })
                    }
                    pool.close();

                    // В recordset лежит массив результата селекта (в нашем случае он должен быть либо пустым, либо там должен быть 1 юзер)
                    console.log(userResult.recordset);

                });
        });
});

app.listen(3000);
console.log('run server http://localhost:3000/');
