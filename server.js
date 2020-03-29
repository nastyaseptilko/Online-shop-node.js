const fs = require('fs');
const url = require('url');
const express = require("express");
const db = require('./model/db/db_Qdew');
const app = express();

app.use(express.static(__dirname + '/static'));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/view/new.html");
});
app.get("/login", function(request, response){
    response.sendFile(__dirname + "/view/logIn.html");
});
app.get("/pageForWomen", function(request, response){
    response.sendFile(__dirname + "/view/pageForWomen.html");
});
app.get("/pageForMen", function(request, response){
    response.sendFile(__dirname + "/view/pageForMen.html");
});
app.get("/pageForChildren", function(request, response){
    response.sendFile(__dirname + "/view/pageForChildren.html");
});
app.get("/sale", function(request, response){
    response.sendFile(__dirname + "/view/sale.html");
});
app.get("/register", function(request, response){
    response.sendFile(__dirname + "/view/register.html");
});

app.post("/register", function(request, response){
            let body = '';
            request.on('data', chunk => {
                body += chunk; // преобразовать буфер в строку
            });
            request.on ('end', () => {
                body = decodeURIComponent(body);            // Преобразует строку из utf-8
                body = body.split('&');            // []

                let userInfo = {};
                body.forEach(registerData => {
                    registerData = registerData.split('=');
                    userInfo[registerData[0]] = registerData[1];
                });

                db.connectionPool.connect()
                    .then(pool => {
                        return pool.request()
                            .input('login', db.sql.NVarChar, userInfo.username)
                            .input('password', db.sql.NVarChar, userInfo.password)
                            .input('city', db.sql.NVarChar, userInfo.city)
                            .query(`insert into Users(Login, Password, City) values (@login, @password, @city);`);
                    });
                response.end ('Submit');
            });
});
app.post("/login", function(request, response){
             let body_log = '';
             request.on ('data', chunk => {
                 body_log += chunk; // преобразовать буфер в строку
             });
             request.on ('end', () => {
                body_log = decodeURIComponent(body_log);            // Преобразует строку из utf-8
                body_log = body_log.split('&');            // []
                 console.log(body_log);

                 let userInfo = {};
                 body_log.forEach(registerData => {
                    registerData = registerData.split('=');
                    userInfo[registerData[0]] = registerData[1];
                });

                 db.connectionPool.connect()

                    .then(pool => {
                         return pool.request()
                             .input('login', db.sql.NVarChar, userInfo.username)
                             .input('password', db.sql.NVarChar, userInfo.password)
                             .query(`SELECT * FROM Users WHERE (Login=@login) AND (Password=@password)`)
                             .then(userResult => {
                                 console.log(userInfo);

                                console.log(userResult.recordset);
                             })
                     });

                 response.end ('Submit');
             });
});

app.listen(3000);
console.log('run server http://localhost:3000/');




//
// const server = http.createServer(function (request,response) {
//     if( request.method ==='GET' ) {
//         if(request.url==='/'){
//             let html =  fs.readFileSync('./view/new.html');
//             response.writeHead (200,{ 'Content-Type':'text/html;charset=utf-8'});
//             response.end(html);
//         }
//         else if(request.url==='/login'){
//             let html =  fs.readFileSync('./view/logIn.html');
//             response.writeHead (200,{ 'Content-Type':'text/html;charset=utf-8'});
//             response.end(html);
//         }
//         else if(request.url==='/pageForWomen'){
//             let html =  fs.readFileSync('./view/pageForWomen.html');
//             response.writeHead (200,{ 'Content-Type':'text/html;charset=utf-8'});
//             response.end(html);
//         }
//         else if(request.url==='/pageForMen'){
//             let html =  fs.readFileSync('./view/pageForMen.html');
//             response.writeHead (200,{ 'Content-Type':'text/html;charset=utf-8'});
//             response.end(html);
//         }
//         else if(request.url==='/pageForChildren'){
//             let html =  fs.readFileSync('./view/pageForChildren.html');
//             response.writeHead (200,{ 'Content-Type':'text/html;charset=utf-8'});
//             response.end(html);
//         }
//         else if(request.url==='/register'){
//             let html =  fs.readFileSync('./view/register.html');
//             response.writeHead (200,{ 'Content-Type':'text/html;charset=utf-8'});
//             response.end(html);
//         }
//         else {
//             let filename = request.url.substring(1);
//             fs.readFile('./' + filename, (err, data) => {
//                 if (err != null) {
//                     response.setHeader('Content-Type', 'text/html');
//                     response.statusCode = 404;
//                     response.end();
//                 } else {
//                     let file = fs.readFileSync('./'+filename);
//                     response.end(file);
//                 }
//             });
//         }
//     }
//     else if(request.method==='POST'){
//          if(request.url==='/register' ){
//             let body = '';
//             request.on ('data', chunk => {
//                 body += chunk; // преобразовать буфер в строку
//             });
//             request.on ('end', () => {
//                 body = decodeURIComponent(body);            // Преобразует строку из utf-8
//                 body = body.split('&');            // []
//
//                 let userInfo = {};
//                 body.forEach(registerData => {
//                     registerData = registerData.split('=');
//                     userInfo[registerData[0]] = registerData[1];
//                 });
//
//                 db.connectionPool.connect()
//                     .then(pool => {
//                         return pool.request()
//                             .input('login', db.sql.NVarChar, userInfo.username)
//                             .input('password', db.sql.NVarChar, userInfo.password)
//                             .input('city', db.sql.NVarChar, userInfo.city)
//                             .query(`insert into Users(Login, Password, City) values (@login, @password, @city);`);
//                     });
//                 response.end ('Submit');
//             });
//         }
//         else if (request.url==='/login' ){
//             let body_log = '';
//             request.on ('data', chunk => {
//                 body_log += chunk; // преобразовать буфер в строку
//             });
//             request.on ('end', () => {
//                 body_log = decodeURIComponent(body_log);            // Преобразует строку из utf-8
//                 body_log = body_log.split('&');            // []
//                 console.log(body_log);
//
//                 let userInfo = {};
//                 body_log.forEach(registerData => {
//                     registerData = registerData.split('=');
//                     userInfo[registerData[0]] = registerData[1];
//                 });
//
//                 db.connectionPool.connect()
//
//                     .then(pool => {
//                         return pool.request()
//                             .input('login', db.sql.NVarChar, userInfo.username)
//                             .input('password', db.sql.NVarChar, userInfo.password)
//                             .query(`SELECT * FROM Users WHERE (Login=@login) AND (Password=@password)`)
//                             .then(userResult => {
//                                 console.log(userInfo);
//
//                                 console.log(userResult.recordset);
//                             })
//                     });
//
//                 response.end ('Submit');
//             });
//         }
//
//     }
//     else {
//         response.writeHead (400,{ 'Content-Type':'text/html'});
//         response.end();
//     }
// }).listen(3000);






