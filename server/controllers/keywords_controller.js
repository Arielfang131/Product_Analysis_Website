const keywordstModel = require("../models/keywords_model.js");

async function getKeywords (req, res) {
    try {
        const data = [];
        for (let i = 0; i < req.body.length; i++) {
            const topic = req.body[i].topic;
            if (topic !== "") {
                const obj = {
                    topicId: req.body[i].topicId,
                    keywords: req.body[i].keywords,
                    symbols: req.body[i].symbol
                };
                data.push(obj);
            }
        }
        // console.log(data);
        const sqlResult = await keywordstModel.createKeywords(data);
        console.log(sqlResult);
    } catch (err) {
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getKeywords
};
