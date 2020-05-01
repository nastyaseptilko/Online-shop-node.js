const db = require('./../model/db/db_Qdew');

module.exports = {
    getPageOrderProducts(request,response){
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
                                    ) WHERE ProductItems.Client_Id = ${currentUser.Client_Id} AND ProductItems.Added = 1;`)
                    .then(Result => {
                        if (Result.recordset.length !== 0) {
                            let priceSum = 0;
                            for (let i=0; i < Result.recordset.length; i++){
                                let price = Result.recordset[i].Price;
                                priceSum +=price;
                            }
                            response.render('orders', {
                                title: 'Order products',
                                titlePage: 'Продукты которые вы добавили в корзину',
                                layout: 'likeOrderProducts',
                                productItems: Result.recordset,
                                // TODO: добавить информацию о целом заказе (посчитать сумму всех товаров пользователя)Result.recordset что-то
                                price: priceSum,
                                buttonRealizeOrder:true,
                                alertForMessage: false
                            });
                        } else {
                            response.render('orders', {
                                title: 'Order products',
                                titlePage: 'Продукты которые вы добавили в корзину',
                                layout: 'likeOrderProducts',
                                productItems: Result.recordset,
                                message: 'Ваша корзина пуста!',
                                alertForMessage:true,
                                buttonRealizeOrder: false
                            });
                        }
                        pool.close();
                    });
            });
    },

    setOrderProducts(request,response){
        const {
            productId,
            order
        } = request.body;
        if (!productId) {
            response.status(400).json({});
            return;
        }
        if (order === 1) {
            db.connectionPool.connect()
                .then(pool => {
                    return pool.request()
                        .input('clientId', db.sql.NVarChar, request.user.Client_Id)
                        .input('productId', db.sql.NVarChar, productId)
                        .query(`INSERT INTO ProductItems(Liked, Added, Client_Id, Product_Id) VALUES(DEFAULT, 1, @clientId, @productId);`)
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
                        .query(`DELETE FROM ProductItems WHERE Added = 1 AND Client_Id = @clientId AND Product_Id = @productId;`)
                        .then(result => {
                            pool.close();
                            response.json(result);
                        });
                });
        }
    },
    realizeOrder(request,response){
        const order = request.body;
        if (!order) {
            response.status(400).json({});
            return;
        }
        db.connectionPool.connect()
            .then(pool => {
                let orderInfo = request.body;
                return pool.request()
                    .input('clientId', db.sql.NVarChar, request.user.Client_Id)
                    .input('country', db.sql.NVarChar, orderInfo.country)
                    .input('city', db.sql.NVarChar, orderInfo.city)
                    .input('street', db.sql.NVarChar, orderInfo.street)
                    .input('postcode', db.sql.NVarChar, orderInfo.postcode)
                    .input('price', db.sql.NVarChar, orderInfo.price)
                    .input('comment', db.sql.NVarChar, orderInfo.comment)
                    .query(`INSERT INTO Orders(Client_Id, Order_Date, Country, City, Street, Postcode, Price, Comment) VALUES
                                                (@clientId, DEFAULT, @country, @city, @street, @postcode, @price, @comment);`)
                    .then(userResult => {
                        response.render('ToOrder', {
                            title: 'Order',
                            layout: 'likeOrderProducts'
                        });
                        return pool.request()
                            .input('clientId', db.sql.NVarChar, request.user.Client_Id)
                            .query(`DELETE FROM ProductItems WHERE Added = 1 AND Client_Id = @clientId;`)
                            .then(result => {
                                pool.close();
                            });

                    });
            });
    }


};