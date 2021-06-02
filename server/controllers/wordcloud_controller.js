const nodejieba = require("nodejieba");
const contentListModel = require("../models/contentlist_model.js");

async function getWordcloud (req, res) {
    try {
        const topicId = req.body.topicId;
        const channels = req.body.channel;
        const emotions = req.body.emotion;
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
            sentence += sqlContentResult[i].content;
            // const result = nodejieba.cut(sentence);
            // segmentation.push(result);
        }
        // const sentence = "先從外觀說起，外觀白色紙盒裡面再加上愛馬仕標準橘盒，打開後就直接是腮紅本人，這次有點可惜沒有加上跟唇膏一樣的小袋子，白色陶瓷外殼拿起來很有份量感，磁吸式設計讓整體質感又更加分，打開腮紅有Hermes PARIS 字體壓紋及斜紋壓紋，當然都會儘量不會刷到字體。";
        // const result = nodejieba.cut(sentence);
        // const topN = 5; /* 找出前五個關鍵詞 */
        nodejieba.load({
            stopWordDict: nodejieba.DEFAULT_STOP_WORD_DICT
        });
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
        // console.log(result);
        console.log(popularKeywords);
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
