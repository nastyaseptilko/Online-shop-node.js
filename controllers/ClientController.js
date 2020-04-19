const db = require('./../model/db/db_Qdew');

module.exports = {
    register(request, response) {
        if (!checkPasswordsMatch(request.body.password, request.body.confirm, response)) {
            return;
        }

        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .input('email', db.sql.NVarChar, request.body.username)
                    .query(`SELECT * FROM Clients WHERE (Email=@email)`)
                    .then(userResult => {
                        if (userResult.recordset.length != 0) {
                            response.render('register', {
                                title: 'Register',
                                layout: 'authorization',
                                errorIsUser: 'this user is in the site'
                            });
                            pool.close();
                        } else {
                            createClient(request.body, pool, response);
                        }
                    });
            });
    },

    login(request, response) {
        db.connectionPool.connect()
            .then(pool => {
                let userInfo = request.body;
                return pool.request()
                    .input('email', db.sql.NVarChar, userInfo.username)
                    .input('password', db.sql.NVarChar, userInfo.password)
                    .query(`SELECT * FROM Clients WHERE (Email=@email) AND (Password=@password)`)
                    .then(userResult => {
                        if (userResult.recordset.length != 0) {
                            response.redirect('/');
                        } else {
                            response.render('login', {
                                title: 'Login',
                                layout: 'authorization',
                                error: 'invalid username or password'
                            })
                        }
                        pool.close();
                    });
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

function createClient(userInfo, pool, response) {
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
