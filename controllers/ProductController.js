const db = require('./../model');

module.exports = {
    getPageForWomen(request,response){
        let page = request.query.page;
        if (!page) {
            page = 1;
        }
        db.sequelize.query(`SELECT pr.Product_id, pr.Price, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Images im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Women'
                                  ORDER BY Product_id 
                                  OFFSET ${(page - 1) * 12} ROWS
                                  FETCH NEXT 12 ROWS ONLY;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        ).then(products => {
            response.render('pageForWomen', {
                title: 'For Women',
                layout: 'products',
                titlePage: 'Женская одежда',
                products: products,
                page: page,
                //nextPage: page +=1
                //previousPage: page--
            });
        });
    },

    getPageForMen(request,response){
        let page = request.query.page;
        if (!page) {
            page = 1
        }

        db.sequelize.query(`SELECT pr.Product_id, pr.Price, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Images im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Men'
                                  ORDER BY Product_id 
                                  OFFSET ${(page - 1) * 12} ROWS
                                  FETCH NEXT 12 ROWS ONLY;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        ).then(products => {
            response.render('pageForMenShop', {
                title: 'For Men',
                layout: 'products',
                titlePage: 'мужская одежда',
                products: products,
                page: page
            });
        });
    },

    getPageForChildren(request,response){
        let page = request.query.page;
        if (!page) {
            page = 1
        }

        db.sequelize.query(`SELECT pr.Product_id, pr.Price, img.Url
                                  FROM Products pr
                                  CROSS APPLY
                                  (
                                      SELECT TOP 1 im.Url
                                      FROM Images im
                                      WHERE im.Product_id = pr.Product_id
                                  ) img WHERE Category = 'For Children'
                                  ORDER BY Product_id 
                                  OFFSET ${(page - 1) * 12} ROWS
                                  FETCH NEXT 12 ROWS ONLY;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        ).then(products => {
            response.render('pageForChildren', {
                title: 'For Children',
                layout: 'products',
                titlePage: 'детская одежда',
                products: products,
                page: page
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

        db.Products.findByPk(productId)
            .then(async product => {
                if (product) {
                    let productItem;
                    let productItemOrder;
                    const currentUser = request.user;
                    if (currentUser) {
                        productItem = await db.ProductItems.findOne({
                            where: {
                                Liked: 1,
                                Client_Id: currentUser.Client_Id,
                                Product_Id: productId
                            }
                        });
                        productItemOrder = await db.ProductItems.findOne({
                            where: {
                                Added: 1,
                                Client_Id: currentUser.Client_Id,
                                Product_Id: productId
                            }
                        });
                    }

                    const images = await db.Images.findAll({where: {Product_Id: productId}, raw: true});
                    response.render("productEntityDescription", {
                        title: "Description for " + productId + " product",
                        layout: "productDescription",
                        displayHeart: !!currentUser,
                        alreadyLiked: !!productItem,
                        alreadyOrdered: !!productItemOrder,
                        Product_Id: product.Product_Id,
                        Product_Name: product.Name,
                        Description: product.Description,
                        Price: product.Price,
                        Discount: product.Discount,
                        Images: images
                    });
                } else {
                    response.status(404).end();
                }
            });
    }
};
