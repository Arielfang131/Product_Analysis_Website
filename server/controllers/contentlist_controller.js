const contentListModel = require("../models/contentlist_model.js");

async function getContentList (req, res) {
    try {
        const topicId = req.body.topicId;
        const channels = req.body.channel;
        const nowTime = req.body.nowTime;
        // const timeValue = req.body.timeValue;
        const deadline = req.body.deadline;
        const sqlResult = await contentListModel.getKeywords(topicId);
        let contentQuery = "";
        let titleQuery = "";
        for (const i in sqlResult) {
            let keywords = `content LIKE '%${sqlResult[i].keyword}%' OR `;
            let keywordsTitle = `title LIKE '%${sqlResult[i].keyword}%' OR `;
            if (parseInt(i) === (sqlResult.length - 1)) {
                keywords = `content LIKE '%${sqlResult[i].keyword}%'`;
                keywordsTitle = `title LIKE '%${sqlResult[i].keyword}%'`;
            }
            contentQuery += keywords;
            titleQuery += keywordsTitle;
        }
        let channelQuery = "";
        for (const i in channels) {
            let channel = `channel = "${channels[i]}" OR `;
            if (parseInt(i) === channels.length - 1) {
                channel = `channel = "${channels[i]}"`;
            }
            channelQuery += channel;
        }
        const sqlContentResult = await contentListModel.getSQLcontent(contentQuery, titleQuery, channelQuery, nowTime, deadline);
        res.send(sqlContentResult);
    } catch (err) {
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getContentList
};
