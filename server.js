const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const expressHandlebars = require('express-handlebars');

const db = require('./model/db/db_Qdew');
const clientController = require('./controllers/ClientController');
const productController = require('./controllers/ProductController');
const likeProductsController = require('./controllers/LikeProductsController');
const app = express();

const jwtSecret = 'qytwdbquwnfkwejbhwebf83478riywhbfsnwnq3r8';


app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/like', function (request, response, next) {
    const token = request.cookies.token;
    if (!token) {
        clientController.getPageLogin(request, response);
    } else {
        jwt.verify(token, jwtSecret, function (err, decoded) {
            if (err) {
                clientController.getPageLogin(request, response);
            } else {
                request.user = decoded.user;
                next();
            }
        });
    }
});

app.use('/products/:productId', function (request, response, next) {
    const token = request.cookies.token;
    if (token) {
        jwt.verify(token, jwtSecret, function (err, decoded) {
            if (err) {
                clientController.getPageLogin(request, response);
            } else {
                request.user = decoded.user;
                next();
            }
        });
    } else {
        next();
    }
});


app.get("/", function (request, response) {
    response.sendFile(__dirname + "/view/new.html");
});

app.get("/login", clientController.getPageLogin);

app.get("/logout", clientController.logout);

app.get("/register", clientController.getPageRegister);

app.get("/pageForWomen", productController.getPageForWomen);

app.get("/pageForMen", productController.getPageForMen);

app.get("/pageForChildren", productController.getPageForChildren);

app.get("/products/:productId", productController.getPageDescription);

app.get("/sale", function (request, response) {
    response.sendFile(__dirname + "/view/sale.html");
});

app.get("/like", likeProductsController.getPageLikedProducts);

app.get("/orders", function (request, response) {
    response.sendFile(__dirname + "/view/orders.html");
});

app.post("/register", clientController.register);

app.post("/login", clientController.login);

app.post("/like", function (request, response) {
    const {
        productId,
        like
    } = request.body;
    if (!productId) {
        response.status(400).json({});
        return;
    }
    if (like === 1) {
        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .input('clientId', db.sql.NVarChar, request.user.Client_Id)
                    .input('productId', db.sql.NVarChar, productId)
                    .query(`INSERT INTO ProductItems(Liked, Added, Client_Id, Product_Id) VALUES(1, DEFAULT, @clientId, @productId);`)
                    .then(result => {
                        pool.close();
                        response.json(result);
                    });
            });
    } else {
        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .input('clientId', db.sql.NVarChar, request.user.Client_Id)
                    .input('productId', db.sql.NVarChar, productId)
                    .query(`DELETE FROM ProductItems WHERE Liked = 1 AND Client_Id = @clientId AND Product_Id = @productId;`)
                    .then(result => {
                        pool.close();
                        response.json(result);
                    });
            });
    }
});

app.listen(3000);
console.log('run server http://localhost:3000/');
