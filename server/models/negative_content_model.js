const { query } = require("./mysqlcon");
const contentListModel = require("./content_list_model.js");
require("dotenv").config();
const { EMOTION_NEGATIVE } = process.env;

const insertAllNegative = async function () {
    try {
        // select ten days before
        const date = new Date();
        date.setDate(date.getDate() - 10);
        let dateInfo = "";
        const dateString = date.getDate().toString();
        if (dateString.length === 1) {
            const dateZero = ("0" + dateString);
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dateZero;
        } else {
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        const sql = "SELECT * FROM keywords_table;";
        const result = await query(sql);
        const data = [];
        for (let i = 0; i < result.length; i++) {
            const keywordsId = result[i].keywords_id;
            const queryInfo = contentListModel.getSQLSyntax([result[i]]);
            const newQuery = contentListModel.getNewKeywords(queryInfo.firstKeyword, queryInfo.secondKeywords);
            const sqlText = `SELECT id FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (time >'${dateInfo} 00:00') AND emotion ${EMOTION_NEGATIVE} order by time DESC;`;
            const sqlResult = await query(sqlText, newQuery);
            if (sqlResult.length === 0) {
                continue;
            }
            for (const j in sqlResult) {
                const obj = {
                    topic_id: keywordsId,
                    text_id: sqlResult[j].id
                };
                data.push(obj);
            }
        }
        const ansArr = [];
        for (const i in data) {
            const ans = [];
            const topicId = data[i].topic_id;
            const textId = data[i].text_id;
            ans.push(topicId, textId);
            ansArr.push(ans);
        }

        const newArr = [];
        if (ansArr.length !== 0) {
            for (const i in ansArr) {
                const sqlCheck = `SELECT * FROM negative_table WHERE topic_id = ${ansArr[i][0]} AND text_id =${ansArr[i][1]};`;
                const checkResult = await query(sqlCheck);
                if (checkResult.length === 0) {
                    newArr.push(ansArr[i]);
                }
            }
            if (newArr.length !== 0) {
                const sqlNegative = "INSERT INTO negative_table (topic_id, text_id) VALUES ?";
                await query(sqlNegative, [newArr]);
            }
        }
        return true;
    } catch (err) {
        console.log("test13");
        console.log(err);
        return {};
    }
};

const selectNegative = async function (companyNo, deadline) {
    try {
        const sql = "SELECT negative_table.text_id FROM company_table INNER JOIN topic_table ON topic_table.company_id = company_table.company_id INNER JOIN negative_table ON negative_table.topic_id = topic_table.topic_id WHERE company_table.company_number = ?;";
        const result = await query(sql, companyNo);
        if (result.length === 0) {
            return result;
        }
        let idString = "(";
        for (const i in result) {
            if (parseInt(i) === (result.length - 1)) {
                idString += `${result[i].text_id})`;
                break;
            }
            idString += `${result[i].text_id},`;
        }
        const sqlContent = `SELECT * FROM text_table_modified WHERE id IN ${idString} AND (time > '${deadline} 00:00') order by time DESC;`;
        const sqlResult = await query(sqlContent);
        return sqlResult;
    } catch (err) {
        console.log("test26");
        console.log(err);
        return {};
    }
};

module.exports = {
    insertAllNegative,
    selectNegative
};
