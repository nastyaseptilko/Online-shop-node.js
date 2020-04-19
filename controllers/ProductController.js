const db = require('./../model/db/db_Qdew');

module.exports = {
    getPageForWomen(request,response){
        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .query(`SELECT pr.Product_id, pr.Price, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Image im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Women'`)
                    .then(Result => {
                        if (Result.recordset.length != 0) {
                            response.render('pageForWomen', {
                                title: 'For Women',
                                layout: 'products',
                                titlePage: 'women shop',
                                products: Result.recordset
                            });
                        } else {
                            console.log("ERROR");
                        }
                        pool.close();
                    });
            });
    },
    getPageForMen(request,response){
        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .query(`SELECT pr.Product_id, pr.Price, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Image im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Men'`)
                    .then(Result => {
                        if (Result.recordset.length != 0) {
                            response.render('pageForMenShop', {
                                title: 'For Men',
                                layout: 'products',
                                titlePage: 'men shop',
                                products: Result.recordset
                            });
                        } else {
                            console.log("ERROR");
                        }
                        pool.close();
                    });
            });

    },
    getPageForChildren(request,response){
        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .query(`SELECT pr.Product_id, pr.Price, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Image im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Children'`)
                    .then(Result => {
                        if (Result.recordset.length != 0) {
                            response.render('pageForChildren', {
                                title: 'For Children',
                                layout: 'products',
                                titlePage: 'children shop',
                                products: Result.recordset
                            });
                        } else {
                            console.log("ERROR");
                        }
                        pool.close();
                    });
            });
    },
    getPageDescription(request,response){
        // Если придет строка, а мы конвертим в число - в переменную запишется NaN == false
        const productId = Number(request.params.productId);
        if (!productId) {
            response.status(404).end();
            return;
        }

        db.connectionPool.connect()
            .then(pool => {
                return pool.request()
                    .query(`SELECT * FROM Products WHERE Product_id = ` + productId)
                    .then(async Result => {
                        if (Result.recordset.length != 0) {
                            const images = await pool.query('SELECT * FROM Image WHERE Product_id = ' + productId);

                            response.render("productEntityDescription", {
                                title: "Description for " + productId + " product",
                                layout: "productDescription",
                                Product_Name: Result.recordset[0].Name,
                                Description: Result.recordset[0].Description,
                                Price: Result.recordset[0].Price,
                                Discount: Result.recordset[0].Discount,
                                Images: images.recordset
                            });
                        } else {
                            response.status(404).end();
                        }
                        pool.close();
                    });
            });
    }


};
