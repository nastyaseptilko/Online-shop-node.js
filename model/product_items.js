
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('productitems', {
        ProductItem_Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Liked: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        Added: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        Client_Id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Product_Id: {
            type: Sequelize.INTEGER
        },
        Order_Id: {
            type: Sequelize.INTEGER
        }
    });
}