const { query } = require("./mysqlcon");
require("dotenv").config();
const { EMOTION_NEGATIVE, EMOTION_NEUTRAL, EMOTION_POSITIVE } = process.env;

const selectTopic = async function (companyNo) {
    try {
        const sql = "SELECT company_table.company_id, topic_table.topic_id, topic_table.topic_name FROM company_table INNER JOIN topic_table ON company_table.company_id = topic_table.company_id WHERE company_table.company_number = ?;";
        const result = await query(sql, companyNo);
        return result;
    } catch (err) {
        console.log("test28");
        console.log(err);
        return {};
    }
};

const getKeywords = async function (topicId) {
    try {
        const sql = "SELECT keywords, symbols FROM keywords_table WHERE keywords_id = ?;";
        const keywords = await query(sql, topicId);
        return keywords;
    } catch (err) {
        console.log("test24");
        console.log(err);
        return {};
    }
};

const getSQLSyntax = async function (sqlResult, channels) {
    try {
        const symbols = sqlResult[0].symbols.split(",");
        const symbolsCopied = symbols.map((element) => {
            return element;
        });
        const firstKeyword = sqlResult[0].keywords.split("+")[0];
        let strSecond = "(";
        let titleSecond = "(";
        let contentQuery = "";
        let titleQuery = "";
        let strFirst = `(content LIKE "%${firstKeyword}%") `;
        strFirst += `${symbols.shift()} `;
        let titleFirst = `(title LIKE "%${firstKeyword}%") `;
        titleFirst += `${symbolsCopied.shift()} `;
        contentQuery = strFirst;
        titleQuery = titleFirst;

        if (sqlResult[0].keywords.split("+")[1].length !== 0) {
            const secondKeywordsArr = sqlResult[0].keywords.split("+")[1].split(",");
            for (let j = 0; j < secondKeywordsArr.length; j++) {
                if (j === (secondKeywordsArr.length - 1)) {
                    strSecond += `content LIKE "%${secondKeywordsArr[j]}%" `;
                    strSecond += ") ";
                    titleSecond += `title LIKE "%${secondKeywordsArr[j]}%" `;
                    titleSecond += ") ";
                    contentQuery = strFirst + strSecond;
                    titleQuery = titleFirst + titleSecond;
                    continue;
                }
                strSecond += `content LIKE "%${secondKeywordsArr[j]}%" `;
                strSecond += `${symbols.shift()} `;
                titleSecond += `title LIKE "%${secondKeywordsArr[j]}%" `;
                titleSecond += `${symbolsCopied.shift()} `;
            }
        }
        let channelQuery = "";
        for (const i in channels) {
            let channel = `channel = "${channels[i]}" OR `;
            if (parseInt(i) === channels.length - 1) {
                channel = `channel = "${channels[i]}"`;
            }
            channelQuery += channel;
        }
        const data = {
            contentQuery: contentQuery,
            titleQuery: titleQuery,
            channelQuery: channelQuery
        };
        return data;
    } catch (err) {
        console.log("test27");
        console.log(err);
        return {};
    }
};

const getSQLcontent = async function (sqlResult, channels, nowTime, deadline, emotions) {
    try {
        let emotionQuery = "";
        let emotion = "";
        for (const i in emotions) {
            if (emotions[i] === "negative") {
                if (parseInt(i) === emotions.length - 1) {
                    emotion = "emotion " + EMOTION_NEGATIVE;
                } else {
                    emotion = "emotion " + EMOTION_NEGATIVE + " OR ";
                }
                emotionQuery += emotion;
            } else if (emotions[i] === "neutral") {
                if (parseInt(i) === emotions.length - 1) {
                    emotion = "emotion " + EMOTION_NEUTRAL;
                } else {
                    emotion = "emotion " + EMOTION_NEUTRAL + " OR ";
                }
                emotionQuery += emotion;
            } else {
                if (parseInt(i) === emotions.length - 1) {
                    emotion = "emotion " + EMOTION_POSITIVE;
                } else {
                    emotion = "emotion " + EMOTION_POSITIVE + " OR ";
                }
                emotionQuery += emotion;
            }
        }
        const queryInfo = await getSQLSyntax(sqlResult, channels);
        const sql = `SELECT * FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND (${emotionQuery}) order by time DESC;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test2");
        console.log(err);
        return {};
    }
};

const getSQLcontentNoEmotion = async function (sqlResult, channels, nowTime, deadline) {
    try {
        const queryInfo = await getSQLSyntax(sqlResult, channels);
        const sql = `SELECT * FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') order by time DESC;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test9");
        console.log(err);
        return {};
    }
};

module.exports = {
    selectTopic,
    getKeywords,
    getSQLSyntax,
    getSQLcontent,
    getSQLcontentNoEmotion
};
