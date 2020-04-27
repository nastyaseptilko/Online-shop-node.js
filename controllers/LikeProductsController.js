const db = require('./../model/db/db_Qdew');

module.exports = {
    getPageLikedProducts(request, response) {
        //TODO: сделать селект из ProductsItem   с 2мя условиями на проверку Liked=1 AND ClientId =request.user.Client_id
        db.connectionPool.connect()
            .then(pool => {
                const currentUser = request.user;
                return pool.request()
                    .query(`select pr.Product_id, pr.Name, pr.Price, pr.Description,
                                      ProductItems.Client_Id, 
                                      im.Url
                                    from Products pr
                                    left join ProductItems on pr.Product_id = ProductItems.Product_id
                                    left join Image im on im.Image_Id =(
                                        SELECT TOP 1 Image_Id 
                                        FROM Image
                                        WHERE Product_id = pr.Product_id
                                    ) WHERE ProductItems.Client_Id = ${currentUser.Client_Id} AND ProductItems.Liked = 1;`)
                    .then(Result => {
                        if (Result.recordset.length != 0) {

                            response.render('like', {
                                title: 'Like products',
                                titlePage: 'Продукты которые вы лайкнули',
                                layout: 'likeOrderProducts',
                                productItems: Result.recordset
                            });
                        } else {
                            console.log("ERROR");
                        }
                        pool.close();
                    });
            });

    },
    setPageLikedProducts (request, response) {
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
    }


};