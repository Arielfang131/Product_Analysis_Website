const { pool } = require("./mysqlcon");
const { SPECIAL_WORDS } = process.env;

const sqlModifiedEmotion = async function () {
    const conn = await pool.getConnection();
    try {
        await conn.query("START TRANSACTION");
        const deleteSql = "DELETE FROM text_table_modified";
        await conn.query(deleteSql);
        const sql = "SELECT * FROM text_table";
        const result = await conn.query(sql);
        const newResult = [];
        const specialWords = SPECIAL_WORDS.split(",");
        for (const i in result[0]) {
            for (const j in specialWords) {
                const specialWord = new RegExp(specialWords[j]);
                if (specialWord.test(result[0][i].content) === true) {
                    result[0][i].emotion = 0.3;
                }
            }
            newResult.push(result[0][i]);
        }
        const dataArr = [];
        for (const i in newResult) {
            const data = [];
            const author = newResult[i].author;
            const title = newResult[i].title;
            const time = newResult[i].time;
            const push = newResult[i].push_number;
            const likes = newResult[i].likes_number;
            const channel = newResult[i].channel;
            const link = newResult[i].link;
            const content = newResult[i].content;
            const emotion = newResult[i].emotion;
            const bodyTextORcomment = newResult[i].body_textORcomment;
            const modifiedTime = new Date();
            data.push(title, content, bodyTextORcomment, channel, link, time, push, likes, author, emotion, modifiedTime);
            dataArr.push(data);
        }
        const sqlInsert = "INSERT INTO text_table_modified (title, content, body_textORcomment, channel, link, time, push_number, likes_number, author, emotion,modified_time) VALUES ?";
        const modifiedResult = await conn.query(sqlInsert, [dataArr]);
        console.log("modified emotion");
        await conn.query("COMMIT");
        return modifiedResult;
    } catch (err) {
        console.log("test23");
        console.log(err);
        await conn.query("ROLLBACK");
        return false;
    } finally {
        await conn.release();
    }
};

module.exports = {
    sqlModifiedEmotion
};
