const nodejieba = require("nodejieba");
const contentListModel = require("../models/content_list_model.js");

// replace link、email and image
function replaceExtraText (inputText) {
    let replacedText = "";

    // URLs starting with http://, https://, or ftp://
    const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, "");

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, "");

    // Change email addresses to mailto:: links.
    const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, "");
    // replace image
    const replacePattern4 = /jpg|jpeg|png|gif|imgur/;
    replacedText = replacedText.replace(replacePattern4, "");
    return replacedText;
}

async function getWordcloud (req, res) {
    try {
        const topicId = req.body.topicId;
        const channels = req.body.channel;
        const nowTime = req.body.nowTime;
        const deadline = req.body.deadline;
        const sqlResult = await contentListModel.getKeywords(topicId);
        const sqlContentResult = await contentListModel.getSQLcontentNoEmotion(sqlResult, channels, nowTime, deadline);
        let sentence = "";
        for (let i = 0; i < sqlContentResult.length; i++) {
            sentence += replaceExtraText(sqlContentResult[i].content);
        }

        const popularData = nodejieba.extract(sentence, 15);
        const popularKeywords = [];
        for (const i in popularData) {
            const popularKeyword = [];
            popularKeyword.push(popularData[i].word);
            const weight = Math.round(popularData[i].weight);
            popularKeyword.push(weight);
            popularKeywords.push(popularKeyword);
        }
        res.send(popularKeywords);
        return;
    } catch (err) {
        console.log("test22");
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getWordcloud
};
