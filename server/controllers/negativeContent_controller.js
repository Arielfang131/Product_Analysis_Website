const jwt = require("jsonwebtoken");
const negativeModel = require("../models/negativeContent_model.js");

async function insertNegative (req, res) {
    console.log("insertNegative");
    await negativeModel.insertAllNegative();
    res.send("finished insertNegative");
}

async function getNegativeContent (req, res) {
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
    // console.log(deadline);
    const result = await negativeModel.selectNegative(companyNo, deadline);
    res.send(JSON.stringify(result));
}

module.exports = {
    insertNegative,
    getNegativeContent
};
