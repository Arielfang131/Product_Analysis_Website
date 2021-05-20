require("dotenv").config();
const mysql = require("mysql");
// 使用redis
// const redis = require("redis");

// create connection
const db = mysql.createPool({
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

// // 設定redis port
// const REDIS_PORT = process.env.PORT || 6379;
// const client = redis.createClient(REDIS_PORT);

module.exports = {
    core: mysql,
    query: dbsql
};
