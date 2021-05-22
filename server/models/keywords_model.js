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
const createKeywords = async function (data) {
    const resultArr = [];
    for (const i in data) {
        const result = [];
        const topicId = data[i].topicId;
        const keywords = data[i].keywords;
        const symbols = data[i].symbols;
        result.push(topicId, keywords.join("+"), symbols.toString());
        resultArr.push(result);
    }
    const sql = "INSERT INTO keywords_table (topic_id, keywords,symbols) VALUES?";
    const result = await query(sql, [resultArr]);
    return result;
};

const selectKeywords = async function () {
    const sql = "SELECT * FROM keywords_table;";
    const result = await query(sql);
    return result;
};

module.exports = {
    createKeywords,
    selectKeywords
};
