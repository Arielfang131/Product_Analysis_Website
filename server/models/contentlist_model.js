const { query } = require("./mysqlcon");

const selectTopic = async function (companyNo) {
    const sql = "SELECT company_table.company_id, topic_table.topic_id, topic_table.topic_name FROM company_table INNER JOIN topic_table ON company_table.company_id = topic_table.company_id WHERE company_table.company_number = ?;";
    const result = await query(sql, companyNo);
    return result;
};

const getKeywords = async function (topicId) {
    const sql = "SELECT keywords, symbols FROM keywords_table WHERE keywords_id = ?;";
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
    selectTopic,
    getKeywords,
    getSQLcontent
};
