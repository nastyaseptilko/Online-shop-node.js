const db = require('./../model');

module.exports = {
    getPageLikedProducts(request, response) {

        db.sequelize.query(`SELECT pr.Product_id, pr.Name, pr.Price, pr.Description,
                                  ProductItems.Client_Id, 
                                  im.Url
                           FROM Products pr
                           left join ProductItems on pr.Product_id = ProductItems.Product_id
                           left join Images im on im.Image_Id = (
                                  SELECT TOP 1 Image_Id 
                                  FROM Images
                                  WHERE Product_id = pr.Product_id
                           ) WHERE ProductItems.Client_Id = ${request.user.Client_Id} AND ProductItems.Liked = 1`,
            { type: db.Sequelize.QueryTypes.SELECT }
            ).then(likedProducts => {
               // console.log(JSON.stringify(likedProducts, null, '  '))
                response.render('like', {
                    title: 'Like products',
                    titlePage: 'Избранное',
                    layout: 'likeOrderProducts',
                    productItems: likedProducts
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
            db.ProductItems.create({
                Liked: 1,
                Client_Id: request.user.Client_Id,
                Product_Id: productId
            }).then(productItem => {
                response.json(productItem);
            });
        } else {
            db.ProductItems.findOne({
                where: {
                    Liked: 1,
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
    }
};
