const nodejieba = require("nodejieba");
nodejieba.load({
    stopWordDict: "server\\controllers\\stopwords.txt"
});

console.log(nodejieba);
const fs = require("fs");

const path = "server\\controllers\\stopwords.txt";

try {
    if (fs.existsSync(path)) {
        console.log("file exists");
    }
} catch (err) {
    console.error(err);
}
const contentListModel = require("../models/contentlist_model.js");

function linkify (inputText) {
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
    // replace jpg.
    const replacePattern4 = /jpg|jpeg|png|gif|imgur/;
    replacedText = replacedText.replace(replacePattern4, "");
    return replacedText;
}

async function getWordcloud (req, res) {
    try {
        const topicId = req.body.topicId;
        const channels = req.body.channel;
        const nowTime = req.body.nowTime;
        // const timeValue = req.body.timeValue;
        const deadline = req.body.deadline;

        const sqlResult = await contentListModel.getKeywords(topicId);
        const symbols = sqlResult[0].symbols.split(",");
        const symbols2 = symbols.map((element) => {
            return element;
        });
        const firstKeywordsArr = sqlResult[0].keywords.split("+")[0].split(",");
        // if (sqlResult[0].keywords.split("+")[1].length !== 0) {
        //     const secondKeywordsArr = sqlResult[0].keywords.split("+")[1].split(",");
        // }
        let strFirst = "(";
        let strSecond = "(";
        let titleFirst = "(";
        let titleSecond = "(";
        let contentQuery = "";
        let titleQuery = "";
        for (let i = 0; i < firstKeywordsArr.length; i++) {
            if (i === (firstKeywordsArr.length - 1)) {
                strFirst += `content LIKE "%${firstKeywordsArr[i]}%" `;
                strFirst += ") ";
                strFirst += `${symbols.shift()} `;
                titleFirst += `title LIKE "%${firstKeywordsArr[i]}%" `;
                titleFirst += ") ";
                titleFirst += `${symbols2.shift()} `;
                contentQuery = strFirst;
                titleQuery = titleFirst;
                continue;
            }
            strFirst += `content LIKE "%${firstKeywordsArr[i]}%" `;
            strFirst += `${symbols.shift()} `;
            titleFirst += `title LIKE "%${firstKeywordsArr[i]}%" `;
            titleFirst += `${symbols2.shift()} `;
        }

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
                titleSecond += `${symbols2.shift()} `;
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
        const sqlContentResult = await contentListModel.getSQLcontentNoEmotion(contentQuery, titleQuery, channelQuery, nowTime, deadline);
        let sentence = "";
        for (let i = 0; i < sqlContentResult.length; i++) {
            sentence += linkify(sqlContentResult[i].content);
            // const result = nodejieba.cut(sentence);
            // segmentation.push(result);
        }

        const popularData = nodejieba.extract(sentence, 20);
        console.log(popularData);
        const popularKeywords = [];
        for (const i in popularData) {
            const popularKeyword = [];
            popularKeyword.push(popularData[i].word);
            const weight = Math.round(popularData[i].weight);
            popularKeyword.push(weight);
            popularKeywords.push(popularKeyword);
        }
        console.log(popularKeywords);
        res.send(popularKeywords);
    } catch (err) {
        console.log("test22");
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getWordcloud
};
