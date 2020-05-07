const db = require('./../model/db/db_Qdew');

module.exports = {
    getMainPage(request, response) {
        const currentUser = request.user;
        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .query(`SELECT pr.Product_id, pr.Price,pr.Name, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Image im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Women' 
                                  ORDER BY Product_id 
                                  OFFSET 15 ROWS
                                  FETCH NEXT 3 ROWS ONLY;`)
                    .then(Result =>{
                        if (currentUser) {
                            response.render('main', {
                                title: 'Qdew',
                                layout: 'mainPage',
                                icoLogin: false,
                                icoOrder: true,
                                icoLike: true,
                                icoLogout: true,
                                favoriteProducts:Result.recordset
                            });
                        }
                        else{
                            response.render('main', {
                                title: 'Qdew',
                                layout: 'mainPage',
                                icoLogin: true,
                                icoOrder: false,
                                icoLike: false,
                                icoLogout: false,
                                favoriteProducts:Result.recordset
                            });}
                        pool.close();
                    })
            })
        }
    };
