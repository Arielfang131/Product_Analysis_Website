const { query } = require("./mysqlcon");

const selectCompanyId = async function (companyNo) {
    try {
        const sql = "SELECT company_id FROM company_table WHERE company_number =?;";
        const result = await query(sql, companyNo);
        return result;
    } catch (err) {
        console.log("test30");
        console.log(err);
        return {};
    }
};

const selectAllTopics = async function (companyNo) {
    try {
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
        return result;
    } catch (err) {
        console.log("test31");
        console.log(err);
        return {};
    }
};

const createTopic = async function (topicData) {
    try {
        const resultArr = [];
        for (const i in topicData) {
            const result = [];
            const topicNumber = topicData[i].topicNumber;
            const topicName = topicData[i].topicName;
            const companyId = topicData[i].companyId;
            result.push(topicNumber, topicName, companyId);
            resultArr.push(result);
        }
        const sql = "INSERT INTO topic_table (topic_number, topic_name, company_id) VALUES ?;";
        const result = await query(sql, [resultArr]);
        return result;
    } catch (err) {
        console.log("test32");
        console.log(err);
        return {};
    }
};

const createKeywords = async function (data) {
    try {
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
    } catch (err) {
        console.log("test33");
        console.log(err);
        return {};
    }
};

const selectKeywords = async function () {
    try {
        const sql = "SELECT * FROM keywords_table;";
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test34");
        console.log(err);
        return {};
    }
};

const deleteTopicAndKeywords = async function (topicId) {
    try {
        const sql = `DELETE topic_table,keywords_table FROM  keywords_table
        INNER JOIN topic_table ON keywords_table.keywords_id = topic_table.topic_id 
        WHERE
        keywords_table.keywords_id  = ?;`;
        await query(sql, topicId);
        return true;
    } catch (err) {
        console.log("test29");
        console.log(err);
        return {};
    }
};

module.exports = {
    selectCompanyId,
    selectAllTopics,
    createTopic,
    createKeywords,
    selectKeywords,
    deleteTopicAndKeywords
};
