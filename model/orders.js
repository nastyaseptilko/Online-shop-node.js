
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('orders', {
        Order_Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Client_Id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Order_Date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        Country: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        City: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        Street: {
            type: Sequelize.STRING(70),
            allowNull: false
        },
        Postcode: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        Comment: {
            type: Sequelize.STRING
        }
    });
}