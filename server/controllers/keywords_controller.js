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
        // verifyUnescape();
        for (let i = 0; i < req.body.length; i++) {
            const topicName = req.body[i].topic;
            const regex = new RegExp("[!@#$%^&*(),.?\":{}|<>]");
            if (regex.test(topicName)) {
                res.status(400).send("error");
                return;
            }
            // 若topicName是空且大於50字，就不放
            if (topicName !== "" && topicName.length <= 50) {
                obj = {
                    topicNumber: req.body[i].topicNumber,
                    keywords: req.body[i].keywords,
                    symbols: req.body[i].symbols
                };
                const keywordsArr = req.body[i].keywords;
                for (const j in keywordsArr) {
                    for (const k in keywordsArr[j]) {
                        if (keywordsArr[j][k].length > 50) {
                            res.status(400).send("error");
                            return;
                        }
                        if (regex.test(keywordsArr[j][k])) {
                            res.status(404).send("請勿包含特殊字元");
                            return;
                        }
                    }
                }
                topicObj = {
                    topicNumber: req.body[i].topicNumber,
                    topicName: topicName,
                    companyId: companyId
                };
                data.push(obj);
                topicData.push(topicObj);
            } else {
                res.status(400).send("error");
                return;
            }
        }
        const existTopic = await keywordstModel.selectAllTopics(companyNo);
        if ((topicData.length + existTopic.length) > 6) {
            res.status(400).send("error");
            return;
        }
        await keywordstModel.createKeywords(data);
        await keywordstModel.createTopic(topicData);
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
        res.send(result);
    } catch (err) {
        console.log("test6");
        console.log("error: " + err);
        res.send("wrong");
    }
}

async function deleteKeywords (req, res) {
    const topicId = req.body.topicId;
    await keywordstModel.deleteTopicAndKeywords(topicId);
    res.send("finish");
}

module.exports = {
    viewKeywords,
    getKeywords,
    deleteKeywords
};
