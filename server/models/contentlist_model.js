const { query } = require("./mysqlcon");

const getKeywords = async function (topicId) {
    const sql = "SELECT keywords, symbols FROM keywords_table WHERE topic_id = ?;";
    const keywords = await query(sql, topicId);
    return keywords;
};

const getSQLcontent = async function (contentQuery, titleQuery, channel, nowTime, deadline) {
    try {
        const sql = `SELECT * FROM text_table WHERE (${contentQuery} OR ${titleQuery}) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') order by time DESC;`;
        const result = await query(sql);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
        return {};
    }
};

module.exports = {
    getKeywords,
    getSQLcontent
};
