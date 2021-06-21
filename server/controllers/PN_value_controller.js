const contentListModel = require("../models/content_list_model.js");
const pnValueModel = require("../models/PN_value_model.js");
// jsonwebtoken
const jwt = require("jsonwebtoken");

// Based on user information, submit saved topics
async function getTopicInfo (req, res) {
    try {
        const tokenInfo = req.headers.authorization;
        const token = tokenInfo.split(" ")[1];
        const decodeToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
        const companyNo = decodeToken.companyNo;
        const sqlResult = await contentListModel.selectTopic(companyNo);
        const data = [];
        for (const i in sqlResult) {
            const ans = {
                topicId: sqlResult[i].topic_id,
                topicName: sqlResult[i].topic_name
            };
            data.push(ans);
        }
        res.send(JSON.stringify(data));
        return;
    } catch (err) {
        console.log("test17");
        console.log("error: " + err);
        const obj = {
            msg: "wrong"
        };
        res.send(obj);
    }
}

// According to the filter, go to SQL to search the positive and negative
async function getPNValue (req, res) {
    try {
        const topicId = req.body.topicId;
        const channels = req.body.channel;
        const nowTime = req.body.nowTime;
        const deadline = req.body.deadline;
        const sqlResult = await contentListModel.getKeywords(topicId);
        const sqlPositiveCount = await pnValueModel.sqlPositiveCount(sqlResult, channels, nowTime, deadline);
        const sqlNeutralCount = await pnValueModel.sqlNeutralCount(sqlResult, channels, nowTime, deadline);
        const sqleNegativeCount = await pnValueModel.sqlNegativeCount(sqlResult, channels, nowTime, deadline);
        const sqlPositive = await pnValueModel.sqlPositive(sqlResult, channels, nowTime, deadline);
        const sqlNeutral = await pnValueModel.sqlNeutral(sqlResult, channels, nowTime, deadline);
        const sqleNegative = await pnValueModel.sqlNegative(sqlResult, channels, nowTime, deadline);
        const ans = {
            positive: sqlPositiveCount[0]["COUNT(*)"],
            negative: sqleNegativeCount[0]["COUNT(*)"],
            neutral: sqlNeutralCount[0]["COUNT(*)"],
            positiveInfo: sqlPositive,
            neutralInfo: sqlNeutral,
            negativeInfo: sqleNegative
        };
        res.send(ans);
        return;
    } catch (err) {
        console.log("test7");
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getTopicInfo,
    getPNValue
};
