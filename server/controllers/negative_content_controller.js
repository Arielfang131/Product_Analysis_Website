const jwt = require("jsonwebtoken");
const negativeModel = require("../models/negative_content_model.js");

async function insertNegative (req, res) {
    try {
        await negativeModel.insertAllNegative();
        res.send("finished insertNegative");
        return;
    } catch (err) {
        console.log("test38");
        console.log("error: " + err);
        const obj = {
            msg: "wrong"
        };
        res.send(obj);
    }
}

async function getNegativeContent (req, res) {
    try {
        const tokenInfo = req.headers.authorization;
        const token = tokenInfo.split(" ")[1];
        const decodeToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
        const companyNo = decodeToken.companyNo;
        let deadline = "";
        const date = new Date();
        date.setDate(date.getDate() - 10);
        const nowDateString = date.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        const result = await negativeModel.selectNegative(companyNo, deadline);
        res.send(JSON.stringify(result));
        return;
    } catch (err) {
        console.log("test39");
        console.log("error: " + err);
        const obj = {
            msg: "wrong"
        };
        res.send(obj);
    }
}

module.exports = {
    insertNegative,
    getNegativeContent
};
