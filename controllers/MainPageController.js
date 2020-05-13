const db = require('./../model');

module.exports = {
    getMainPage(request, response) {
        const currentUser = request.user;

        db.sequelize.query(`SELECT pr.Product_id, pr.Price,pr.Name, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Images im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Women' 
                                  ORDER BY Product_id 
                                  OFFSET 1 ROWS
                                  FETCH NEXT 2 ROWS ONLY;`,
            {type: db.Sequelize.QueryTypes.SELECT}
        ).then(products => {
            if (currentUser) {
                response.render('main', {
                    title: 'Qdew',
                    layout: 'mainPage',
                    icoLogin: false,
                    icoOrder: true,
                    icoLike: true,
                    icoLogout: true,
                    favoriteProducts: products
                });
            } else {
                response.render('main', {
                    title: 'Qdew',
                    layout: 'mainPage',
                    icoLogin: true,
                    icoOrder: false,
                    icoLike: false,
                    icoLogout: false,
                    favoriteProducts: products
                });
            }
        });
    }
};
