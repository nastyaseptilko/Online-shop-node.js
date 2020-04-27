const db = require('./../model/db/db_Qdew');

module.exports = {
    getMainPage(request, response) {
        const currentUser = request.user;
        if (currentUser) {
            response.render('main', {
                title: 'Qdew',
                layout: 'mainPage',
                icoLogin: false,
                icoOrder: true,
                icoLike: true,
                icoLogout: true
            });
        }
        else{
            response.render('main', {
                title: 'Qdew',
                layout: 'mainPage',
                icoLogin: true,
                icoOrder: false,
                icoLike: false,
                icoLogout: false
            });
        }

    }
};