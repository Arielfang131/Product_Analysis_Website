require("dotenv").config();
const mysql = require("mysql");
const mysqlPromise = require("mysql2/promise");

// create connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: "side_project_test",
    waitForConnections: true,
    connectionLimit: 20
});

// create mysqlPromise connection
const pool = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: "side_project_test",
    waitForConnections: true,
    connectionLimit: 20
});

db.getConnection(function (err, connection) {
    if (err) {
        throw err;
    } else {
        console.log("MySqlpool Connected....");
        connection.release();
        if (err) throw err;
    }
});

pool.getConnection((err) => {
    if (err) throw err;
    console.log("mysql(pool) connecting...");
});

// SQL function
function dbsql (sql, value) {
    const result = new Promise((resolve, reject) => {
        db.query(sql, value, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
    return result;
}

module.exports = {
    core: mysql,
    query: dbsql,
    pool
};
