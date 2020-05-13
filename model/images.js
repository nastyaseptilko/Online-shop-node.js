
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('images', {
        Image_Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Product_Id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Url: {
            type: Sequelize.STRING(150)
        }
    });
}