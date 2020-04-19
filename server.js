const express = require("express");
const expressHandlebars = require('express-handlebars');

const db = require('./model/db/db_Qdew');
const clientController = require('./controllers/ClientController');
const productController = require('./controllers/ProductController');
const app = express();

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));


app.get("/", function (request, response) {
    response.sendFile(__dirname + "/view/new.html");
});

app.get("/login", clientController.getPageLogin);

app.get("/register", clientController.getPageRegister);

app.get("/pageForWomen", productController.getPageForWomen);

app.get("/pageForMen", productController.getPageForMen);

app.get("/pageForChildren", productController.getPageForChildren);

app.get("/products/:productId", productController.getPageDescription);

app.get("/sale", function (request, response) {
    response.sendFile(__dirname + "/view/sale.html");
});

app.get("/likeProducts", function (request, response) {
   // response.sendFile(__dirname + "/view/likeProducts.html");
    console.log("cccc");
    db.connectionPool.connect()
        .then(pool => {
            return pool.request()
        .query(`INSERT INTO ProductItems(Liked, Added, Client_Id, Product_Id, Order_Id) VALUES
('true', DEFAULT, 4, 8, null);`)
   let product = request.body
        .then(product => {
            response.redirect('/');
            pool.close();
        })
});
});
app.get("/orders", function (request, response) {
    response.sendFile(__dirname + "/view/orders.html");
});

app.post("/register", clientController.register);

app.post("/login", clientController.login);

app.listen(3000);
console.log('run server http://localhost:3000/');
