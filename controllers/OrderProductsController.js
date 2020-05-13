const db = require('./../model');

module.exports = {
    getPageOrderProducts(request,response){

        db.sequelize.query(`select pr.Product_id, pr.Name, pr.Price, pr.Description,
                                      ProductItems.Client_Id, 
                                      im.Url
                                    from Products pr
                                    left join ProductItems on pr.Product_id = ProductItems.Product_id
                                    left join Images im on im.Image_Id =(
                                        SELECT TOP 1 Image_Id 
                                        FROM Images
                                        WHERE Product_id = pr.Product_id
                                    ) WHERE ProductItems.Client_Id = ${request.user.Client_Id} AND ProductItems.Added = 1`,
            {type: db.Sequelize.QueryTypes.SELECT}
        ).then(products => {
            if (products.length !== 0) {
                let priceSum = 0;
                for (let i=0; i < products.length; i++){
                    let price = products[i].Price;
                    priceSum +=price;
                }
                response.render('orders', {
                    title: 'Order products',
                    titlePage: 'Продукты которые вы добавили в корзину',
                    layout: 'likeOrderProducts',
                    productItems: products,
                    price: priceSum,
                    alertForMessage: false,
                    buttonRealizeOrder: true
                });
            } else {
                response.render('orders', {
                    title: 'Order products',
                    titlePage: 'Продукты которые вы добавили в корзину',
                    layout: 'likeOrderProducts',
                    productItems: products,
                    message: 'Ваша корзина пуста!',
                    alertForMessage: true,
                    buttonRealizeOrder: false
                });
            }
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
            db.ProductItems.create({
                Added: 1,
                Client_Id: request.user.Client_Id,
                Product_Id: productId
            }).then(productItem => {
                response.json(productItem);
            });
        } else {
            db.ProductItems.findOne({
                where: {
                    Added: 1,
                    Client_Id: request.user.Client_Id,
                    Product_Id: productId
                }
            }).then(record => {
                if (record) {
                    record.destroy().then(() => response.json(record));
                } else {
                    console.log('There are no such records!!!');
                }
            });
        }
    },

    realizeOrder(request,response){
        const order = request.body;
        if (!order) {
            response.status(400).json({});
            return;
        }

        db.Orders.create({
            Client_Id: request.user.Client_Id,
            Order_Date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
            Country: order.country,
            City: order.city,
            Street: order.street,
            Postcode: order.postcode,
            Price: order.price,
            Comment: order.comment
        }).then(order => {
            response.render('ToOrder', {
                title: 'Order',
                layout: 'likeOrderProducts'
            });
            db.ProductItems.destroy({
                where: {
                    Added: 1,
                    Client_Id: request.user.Client_Id
                }
            });
        });
    }
};
