const { query } = require("./mysqlcon");
const { core } = require("./mysqlcon");

const selectCompanyId = async function (companyNo) {
    const sql = "SELECT company_id FROM company_table WHERE company_number =?;";
    const result = await query(sql, companyNo);
    return result;
};

const selectAllTopics = async function (companyNo) {
    const sql = `SELECT
    company_table.company_id,
    company_table.company_number,
    topic_table.topic_id,
    topic_table.topic_name,
    keywords_table.keywords,
    keywords_table.symbols
    FROM company_table
    INNER JOIN topic_table ON company_table.company_id = topic_table.company_id
    INNER JOIN keywords_table ON topic_table.topic_id = keywords_table.keywords_id
    WHERE company_table.company_number = ?;`;
    const result = await query(sql, companyNo);
    // console.log(core.format(sql, companyNo));
    // console.log("model");
    // console.log(result);
    return result;
};

const createTopic = async function (topicData) {
    const resultArr = [];
    for (const i in topicData) {
        const result = [];
        const topicNumber = topicData[i].topicNumber;
        const topicName = topicData[i].topicName;
        const companyId = topicData[i].companyId;
        result.push(topicNumber, topicName, companyId);
        resultArr.push(result);
    }
    console.log(resultArr);
    const sql = "INSERT INTO topic_table (topic_number, topic_name, company_id) VALUES ?;";
    const result = await query(sql, [resultArr]);
    console.log(result);
    return result;
};

const createKeywords = async function (data) {
    const resultArr = [];
    for (const i in data) {
        const result = [];
        const topicNumber = data[i].topicNumber;
        const keywords = data[i].keywords;
        const symbols = data[i].symbols;
        result.push(topicNumber, keywords.join("+"), symbols.toString());
        resultArr.push(result);
    }
    const sql = "INSERT INTO keywords_table (topic_number, keywords,symbols) VALUES?";
    const result = await query(sql, [resultArr]);
    return result;
};

const selectKeywords = async function () {
    const sql = "SELECT * FROM keywords_table;";
    const result = await query(sql);
    return result;
};

const deleteTopicAndKeywords = async function (topicId) {
    const sql = `DELETE topic_table,keywords_table FROM topic_table
    INNER JOIN keywords_table ON keywords_table.keywords_id = topic_table.topic_id 
    WHERE
    topic_table.topic_id  = ?;`;
    const result = await query(sql, topicId);
    return result;
};

module.exports = {
    selectCompanyId,
    selectAllTopics,
    createTopic,
    createKeywords,
    selectKeywords,
    deleteTopicAndKeywords
};
