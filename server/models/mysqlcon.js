require("dotenv").config();
const mysql = require("mysql");
const mysql2 = require("mysql2/promise");


// create connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: "side_project_test",
    waitForConnections: true,
    connectionLimit: 20
});

// create mysql2 connection
const pool = mysql2.createPool({
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
        // 釋放連線
        connection.release();
        // 不要再使用釋放過後的連線了，這個連線會被放到連線池中，供下一個使用者使用
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
            // if (err) throw err;
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
