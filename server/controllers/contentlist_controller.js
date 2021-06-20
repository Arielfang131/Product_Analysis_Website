const contentListModel = require("../models/content_list_model.js");
const jwt = require("jsonwebtoken");

// Based on user information, submit saved topics
async function getTopicList (req, res) {
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
        console.log("test1");
        console.log("error: " + err);
        const obj = {
            msg: "wrong"
        };
        res.send(obj);
    }
}

async function getContentList (req, res) {
    try {
        const topicId = req.body.topicId;
        const channels = req.body.channel;
        const emotions = req.body.emotion;
        const nowTime = req.body.nowTime;
        const deadline = req.body.deadline;
        const sqlResult = await contentListModel.getKeywords(topicId);
        if (emotions.length === 3) {
            const sqlContentResult = await contentListModel.getSQLcontentNoEmotion(sqlResult, channels, nowTime, deadline);
            res.send(sqlContentResult);
            return;
        } else {
            const sqlContentResult = await contentListModel.getSQLcontent(sqlResult, channels, nowTime, deadline, emotions);
            res.send(sqlContentResult);
            return;
        }
    } catch (err) {
        console.log("test2");
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getTopicList,
    getContentList
};
