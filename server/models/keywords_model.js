const { query } = require("./mysqlcon");

// const selectTopicId = async function () {
//     const sql = "SELECT distinct topic_id FROM keywords_table;";
//     const result = await query(sql);
//     return result;
// };

// const selectKeywords = async function (topicId) {
//     const sql = "SELECT topic_id, keyword FROM keywords_table WHERE topic_id = ?;";
//     const result = await query(sql, topicId);
//     console.log(result);
//     return result;
// };

const selectKeywords = async function () {
    const sql = "SELECT * FROM keywords_table;";
    const result = await query(sql);
    return result;
};

module.exports = {
    selectKeywords
};
