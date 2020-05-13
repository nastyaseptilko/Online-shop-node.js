
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('clients', {
        Client_Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        First_Name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        Last_Name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        Phone_number: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        Email: {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        },
        Password: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        BirthDay: {
            type: Sequelize.DATE
        },
        Country: {
            type: Sequelize.STRING(50)
        },
        City: {
            type: Sequelize.STRING(50)
        },
        Street: {
            type: Sequelize.STRING(70)
        },
        Postcode: {
            type: Sequelize.INTEGER
        }
    });
}