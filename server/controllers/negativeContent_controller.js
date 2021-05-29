const jwt = require("jsonwebtoken");
const negativeModel = require("../models/negativeContent_model.js");

// async function getNegativeContent (req, res) {
//     const tokenInfo = req.headers.authorization;
//     const token = tokenInfo.split(" ")[1];
//     const decodeToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
//     const companyNo = decodeToken.companyNo;
//     const result = await negativeModel.selectTopic(companyNo);
//     const topicId = result[0].topic_id;
//     let deadline;
//     const date = new Date();
//     date.setDate(date.getDate() - 10);
//     const nowDateString = date.getDate().toString();
//     if (nowDateString.length === 1) {
//         const deadlineZero = ("0" + nowDateString);
//         deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + deadlineZero;
//     } else {
//         deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
//     }
//     const negativeContent = await negativeModel.selectNegative(topicId, deadline);
//     res.send(negativeContent);
// }

async function getNegativeContent (req, res) {
    const tokenInfo = req.headers.authorization;
    const token = tokenInfo.split(" ")[1];
    const decodeToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
    const companyNo = decodeToken.companyNo;
    const result = await negativeModel.selectNegative(companyNo);
    // const topicId = result[0].topic_id;
    // let deadline;
    // const date = new Date();
    // date.setDate(date.getDate() - 10);
    // const nowDateString = date.getDate().toString();
    // if (nowDateString.length === 1) {
    //     const deadlineZero = ("0" + nowDateString);
    //     deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + deadlineZero;
    // } else {
    //     deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // }
    // const negativeContent = await negativeModel.selectNegative(topicId, deadline);
    res.send(result);
}

module.exports = {
    getNegativeContent
};
