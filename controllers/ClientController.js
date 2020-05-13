const jwt = require('jsonwebtoken');
const db = require('./../model');

const jwtSecret = 'qytwdbquwnfkwejbhwebf83478riywhbfsnwnq3r8';

module.exports = {
    register(request, response) {
        if (!checkPasswordsMatch(request.body.password, request.body.confirm, response)) {
            return;
        }

        db.Clients.findOne({
            where: {
                Email: request.body.username
            }
        }).then(client => {
            if (client) {
                response.render('register', {
                    title: 'Register',
                    layout: 'authorization',
                    errorIsUser: 'This user has already registered'
                });
            } else {
                db.Clients.create({
                    First_Name: request.body.firstName,
                    Last_Name: request.body.lastName,
                    Phone_number: request.body.phoneNumber,
                    Email: request.body.username,
                    Password: request.body.password,
                    City: request.body.city
                }).then(user => {
                    response.render('login', {
                        title: 'Login',
                        layout: 'authorization'
                    });
                });
            }
        });
    },

    login(request, response) {

        db.Clients.findOne({
            where: {
                Email: request.body.username,
                Password: request.body.password
            }
        }).then(client => {
            if (client) {
                jwt.sign({ user: client }, jwtSecret, function(err, token) {
                    if (err) {
                        console.log('Generate token error');
                    } else {
                        response.cookie('token', token);
                    }
                    response.redirect('/');
                });
            } else {
                response.render('login', {
                    title: 'Login',
                    layout: 'authorization',
                    error: 'Invalid username or password'
                });
            }
        });
    },

    getPageLogin(request, response) {
        response.render('login', {
            title: 'Login',
            layout: 'authorization',
            registerLink: true
        })
    },
    getPageRegister(request,response){
        response.render('register', {
            title: 'Register',
            layout: 'authorization',
            registerLink: false
        });
    },
    logout(request,response){
        response.clearCookie('token');
        response.redirect('/login');
    }

};


function checkPasswordsMatch(password, confirm, response) {
    if (password !== confirm) {
        response.render('register', {
            layout: 'authorization',
            error: 'invalid password'
        });
        return false;
    } else return true;
}
