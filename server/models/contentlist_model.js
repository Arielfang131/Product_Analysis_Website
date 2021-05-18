const { query } = require("./mysqlcon");

const getKeywords = async function (topicId) {
    const sql = "SELECT keyword FROM keywords_table WHERE topic_id = ?;";
    const keywords = await query(sql, topicId);
    return keywords;
};

const getSQLcontent = async function (keywords, titleQuery, channel) {
    // const sql = "SELECT * FROM text_table WHERE ? order by time DESC limit 10;;;;;;;";
    const sql = `SELECT * FROM text_table WHERE ((${keywords}) OR (${titleQuery})) AND (${channel}) order by time DESC limit 10;`;
    // const result = await query(sql, [keywords]);
    const result = await query(sql);
    return result;
};

module.exports = {
    getKeywords,
    getSQLcontent
};
