const contentlistController = require("../controllers/contentlist_controller.js");
const contentListModel = require("../models/contentlist_model.js");
const PNValueModel = require("../models/PNValue_model.js");

// 依據使用者資訊，送出儲存過的主題
async function getTopicInfo (req, res) {
    const topicInfo = await contentlistController.getTopicList();
    res.send(topicInfo);
}

// 依據送出的篩選，去SQL撈正面和負面比重
async function getPNValue (req, res) {
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
        console.log(firstKeywordsArr);

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

        console.log(sqlResult[0].keywords.split("+")[1]);
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
        const sqlPositive = await PNValueModel.getPositive(contentQuery, titleQuery, channelQuery, nowTime, deadline);
        const sqlNeutral = await PNValueModel.getNeutral(contentQuery, titleQuery, channelQuery, nowTime, deadline);
        const sqleNegative = await PNValueModel.getNegative(contentQuery, titleQuery, channelQuery, nowTime, deadline);
        // res.send(sqlContentResult);
    } catch (err) {
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getTopicInfo,
    getPNValue
};
