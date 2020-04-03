const sql = require('mssql/msnodesqlv8');

let dbConfig = {
    driver: 'mssql',
    connectionString:'Driver={SQL Server Native Client 11.0};Server={DESKTOP-2CC1V4D\\SQLEXPRESS};Database={QDEW_BD};Trusted_Connection={yes};'
};

module.exports = {
    connectionPool: new sql.ConnectionPool(dbConfig),
    sql: sql
};
