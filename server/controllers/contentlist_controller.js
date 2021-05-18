const contentListModel = require("../models/contentlist_model.js");

async function getContentList (req, res) {
    const topicId = req.body.topicId;
    const channels = req.body.channel;
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
    const sqlContentResult = await contentListModel.getSQLcontent(contentQuery, titleQuery, channelQuery);
    res.send(sqlContentResult);
}

module.exports = {
    getContentList
};
