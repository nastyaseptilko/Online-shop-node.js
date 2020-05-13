
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('products', {
        Product_Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Category: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        Name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        Price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        Description: {
            type: Sequelize.STRING
        },
        Discount: {
            type: Sequelize.FLOAT
        }
    });
}