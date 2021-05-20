// const contentListModel = require("../models/contentlist_model.js");

async function getKeywords (req, res) {
    try {
        console.log(req.body);
        for (let i = 0; i < req.body.length; i++) {
            const topic = req.body[i].topic;
            if (topic !== "") {
                const keywords = req.body[i].keywords;
                const symbol = req.body[i].symbol;
            }
        }
    } catch (err) {
        console.log("error: " + err);
        res.send("wrong");
    }
}

module.exports = {
    getKeywords
};
