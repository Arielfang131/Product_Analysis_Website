// 載入 jsonwebtoken
const jwt = require("jsonwebtoken");
const keywordstModel = require("../models/keywords_model.js");

async function viewKeywords (req, res) {
    try {
        const tokenInfo = req.headers.authorization;
        const token = tokenInfo.split(" ")[1];
        const decodeToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
        const companyNo = decodeToken.companyNo;
        const sqlResult = await keywordstModel.selectAllTopics(companyNo);
        const result = [];
        for (const i in sqlResult) {
            const obj = {
                topicId: sqlResult[i].topic_id,
                topicName: sqlResult[i].topic_name,
                keywords: sqlResult[i].keywords,
                symbols: sqlResult[i].symbols
            };
            result.push(obj);
        }
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log("test5");
        console.log("error: " + err);
        res.send("wrong");
    }
}

async function getKeywords (req, res) {
    try {
        const tokenInfo = req.headers.authorization;
        const token = tokenInfo.split(" ")[1];
        const decodeToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
        const companyNo = decodeToken.companyNo;
        const companyResult = await keywordstModel.selectCompanyId(companyNo);
        const companyId = companyResult[0].company_id;
        const data = [];
        const topicData = [];
        let obj = {};
        let topicObj = {};
        for (let i = 0; i < req.body.length; i++) {
            const topicName = req.body[i].topic;
            // 若topicName是空的，就不放
            if (topicName !== "") {
                obj = {
                    topicNumber: req.body[i].topicNumber,
                    keywords: req.body[i].keywords,
                    symbols: req.body[i].symbols
                };
                topicObj = {
                    topicNumber: req.body[i].topicNumber,
                    topicName: topicName,
                    companyId: companyId
                };
                data.push(obj);
                topicData.push(topicObj);
            }
        }
        const sqlResult = await keywordstModel.createKeywords(data);
        const sqlTopic = await keywordstModel.createTopic(topicData);
        res.send(JSON.stringify(data));
        // console.log(sqlResult);
        // console.log(sqlTopic);
    } catch (err) {
        console.log("test6");
        console.log("error: " + err);
        res.send("wrong");
    }
}

async function deleteKeywords (req, res) {
    const topicId = req.body.topicId;
    await keywordstModel.deleteTopicAndKeywords(topicId);
}

module.exports = {
    viewKeywords,
    getKeywords,
    deleteKeywords
};
