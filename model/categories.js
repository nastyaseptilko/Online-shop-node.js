
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('categories', {
        Name: {
            type: Sequelize.STRING(20),
            primaryKey: true,
            allowNull: false
        }
    });
}