const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const expressHandlebars = require('express-handlebars');
const WebSocket = require('ws');

const clientController = require('./controllers/ClientController');
const productController = require('./controllers/ProductController');
const likeProductsController = require('./controllers/LikeProductsController');
const mainPageController = require('./controllers/MainPageController');
const orderProductsController = require('./controllers/OrderProductsController');
const salePageController = require('./controllers/SaleController');
const helpPageController = require('./controllers/HelpController');
const app = express();

const jwtSecret = 'qytwdbquwnfkwejbhwebf83478riywhbfsnwnq3r8';


app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/', function (request, response, next) {
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

app.use('/like', function (request, response, next) {
    if (!request.user) {
        clientController.getPageLogin(request, response);
    } else {
        next();
    }
});

app.use('/order', function (request, response, next) {
    if (!request.user) {
        clientController.getPageLogin(request, response);
    } else {
        next();
    }
});

app.get("/", mainPageController.getMainPage);

app.get("/login", clientController.getPageLogin);

app.get("/logout", clientController.logout);

app.get("/register", clientController.getPageRegister);

app.get("/pageForWomen", productController.getPageForWomen);

app.get("/pageForMen", productController.getPageForMen);

app.get("/pageForChildren", productController.getPageForChildren);

app.get("/products/:productId", productController.getPageDescription);

app.get("/sale",salePageController.getSalePage);

app.get("/tableSize",helpPageController.getHelpPage);

app.get("/like", likeProductsController.getPageLikedProducts);

app.get("/orders", orderProductsController.getPageOrderProducts);

app.post("/register", clientController.register);

app.post("/login", clientController.login);

app.post("/like", likeProductsController.setPageLikedProducts);

app.post("/orders", orderProductsController.setOrderProducts);

app.post("/realizeOrder", orderProductsController.realizeOrder);


const cert = {
    key: fs.readFileSync('./certs/resourcePrivateKey.key', 'utf8'),
    cert: fs.readFileSync('./certs/resourceCert.crt', 'utf8')
};
const httpsServer = https.createServer(cert, app);
httpsServer.listen(3000);
console.log('run server https://localhost:3000/');


const wss = new WebSocket.Server({port: 3001});
const initAssistantMessage = 'Здравствуйте, меня зовут Анна! Я online-консультант. Нужна ли Вам помощь?';
const acceptMessage = 'Для того чтобы приобрести у нас товар,вам нужно зарегистривоваться у нас на сайте, а потом войти. В катологе выбрать понравившийся товар, добавить в корзину, далее можно перейти к оформлению заказа! Если у вас возникают проблемы с сайтом обращаться по телефону: 8(033)321-29-79 или написать нам в Telegram: @nseptilko. Спасибо что вы с нами!';
const refuseMessage = 'Без проблем. Приятных покупок!';
const invalidOptionMessage = 'Я вас не понимаю:( Напишите да/нет.';

wss.on('connection', function connection(ws) {

    ws.send(initAssistantMessage);

    ws.on('message', function(message) {
        message = message.toLowerCase();
        let answer = invalidOptionMessage;
        if (message === 'да' || message ==='yes') {
            answer = acceptMessage;
        } else if (message === 'нет' || message ==='no') {
            answer = refuseMessage;
        }
        ws.send(answer);
    });
});

/*
 * Generate SS certificate with the private key
 * openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out ./selfsigned.crt
 */

/*
 * Generate Private key from CA side
 * openssl genrsa -des3 -out caPrivateKey.key 2048
 *
 * Enter pass phrase for caPrivateKey.key: password
 * Verifying - Enter pass phrase for caPrivateKey.key: password
 */

/*
 * Generate Certificate from CA side
 * openssl req -x509 -new -days 365 -sha256 -key ./caPrivateKey.key -sha256 -out ./caCertificate.crt
 *
 * Enter pass phrase for caPrivateKey.key: password
 *
 * Country Name (2 letter code) [AU]:BY
 * State or Province Name (full name) [Some-State]:Minsk
 * Locality Name (eg, city) []:Minsk
 * Organization Name (eg, company) [Internet Widgits Pty Ltd]:CA-LAB22
 * Organizational Unit Name (eg, section) []:CA-LAB22
 * Common Name (e.g. server FQDN or YOUR name) []:CA-LAB22-MIM
 * Email Address []:
 */

/*
 * Generate Private key from Resource side
 * openssl genrsa -out ./resourcePrivateKey.key 2048
 */

/*
 * Generate Certificate request from Resource side
 * openssl req -new -key ./resourcePrivateKey.key -out ./certRequest.csr -sha256 -config ./certificateConfig.cfg
 */

/*
 * Generate Certificate for a Resource from CA side
 * openssl x509 -req -days 365 -sha256 -in ./certRequest.csr -CA ./caCertificate.crt -CAkey ./caPrivateKey.key -CAcreateserial -out ./resourceCert.crt -extensions v3_req -extfile ./certificateConfig.cfg
 *
 * Enter pass phrase for ./caPrivateKey.key: password
 */