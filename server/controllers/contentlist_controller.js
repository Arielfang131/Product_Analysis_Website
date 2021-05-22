const contentListModel = require("../models/contentlist_model.js");

async function getContentList (req, res) {
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

        // contentQuery = strFirst;
        // titleQuery = titleFirst;

        // for (let i = 0; i < symbols.length; i++) { // first array
        //     strFirst += `constent LIKE "%${firstKeywordsArr[i]}%" `;
        //     strFirst += `${symbols[i]} `;
        //     if (i >= firstKeywordsArr.length) { // second array
        //         console.log(firstKeywordsArr.length);
        //         strSecond += `constent LIKE "%${secondKeywordsArr[i - 3]}%" `;
        //         console.log((i - 3));
        //         strSecond += `${symbols[i]} `;
        //     }
        // }
        // console.log(strFirst);
        // console.log(strSecond);

        // for (const i in sqlResult) {
        //     let keywords = `content LIKE '%${sqlResult[i].keywords}%' OR `;
        //     let keywordsTitle = `title LIKE '%${sqlResult[i].keywords}%' OR `;
        //     if (parseInt(i) === (sqlResult.length - 1)) {
        //         keywords = `content LIKE '%${sqlResult[i].keywords}%'`;
        //         keywordsTitle = `title LIKE '%${sqlResult[i].keywords}%'`;
        //     }
        //     contentQuery += keywords;
        //     titleQuery += keywordsTitle;
        // }
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
