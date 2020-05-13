const Sequelize = require('sequelize');

const sequelize = new Sequelize('QDEW_BD1', 'Admin_User', 'password', {
    host: 'localhost',
    dialect: 'mssql',
    define: {
        timestamps: false
    },
    logging: false
});

const clients = require('./clients')(Sequelize, sequelize);
const categories = require('./categories')(Sequelize, sequelize);
const products = require('./products')(Sequelize, sequelize);
const productItems = require('./product_items')(Sequelize, sequelize);
const images = require('./images')(Sequelize, sequelize);
const orders = require('./orders')(Sequelize, sequelize);

products.belongsTo(categories, {foreignKey: 'Category'});

productItems.belongsTo(clients, {foreignKey: 'Client_Id'});
productItems.belongsTo(products, {foreignKey: 'Product_Id'});
productItems.belongsTo(orders, {foreignKey: 'Order_Id'});

images.belongsTo(products, {foreignKey: 'Product_Id'});

orders.belongsTo(clients, {foreignKey: 'Client_Id'});


module.exports = {
    Clients: clients,
    Categories: categories,
    Products: products,
    ProductItems: productItems,
    Images: images,
    Orders: orders,

    Sequelize: Sequelize,
    sequelize: sequelize
};

// true => ВСЕ ДАННЫЕ УДАЛЯТСЯ И ОБНОВЛЯТСЯ В СООТВЕТСТВИИ СТРОГО С JSON ФАЙЛАМИ
// false => ВСЕ ДАННЫЕ ОСТАЮТСЯ В БД КАК ЕСТЬ

sequelize.sync({force: true})
    .then(() => console.log('Db has been synchronizing successfully'))
    .then(() => {
        return Promise.all([
            clients.bulkCreate(require('./data/clients')),
            categories.bulkCreate(require('./data/categories'))
        ]).then(() => Promise.all([
            orders.bulkCreate(require('./data/orders')),
            products.bulkCreate(require('./data/products'))
        ])).then(() => Promise.all([
            productItems.bulkCreate(require('./data/product_items')),
            images.bulkCreate(require('./data/images'))
        ]));
    })
    .catch(err => console.log('Error while synchronizing: ' + err.toString()));
