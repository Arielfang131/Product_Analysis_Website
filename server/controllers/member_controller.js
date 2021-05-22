// 使用env
require("dotenv").config();
// hash
const bcrypt = require("bcrypt");
// 載入 jsonwebtoken
const jwt = require("jsonwebtoken");
const memberModel = require("../models/member_model.js");

async function signin (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const checkEmail = await memberModel.selectEmail(email);
    let obj = {};
    if (checkEmail.length === 0) {
        obj = {
            msg: "查無此會員，請先註冊"
        };
    } else {
        const signinResult = await bcrypt.compare(password, checkEmail[0].password);
        if (signinResult === true) {
            obj = {
                msg: "登入成功"
            };
        }
    }
    res.send(obj);
}

async function register (req, res) {
    const companyName = req.body.companyName;
    const companyNo = req.body.companyNo;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const admin = req.body.admin;
    const checkEmail = await memberModel.selectEmail(email);
    let obj = {};
    if (checkEmail.length === 0) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const sqlResult = await memberModel.registerMember(companyName, companyNo, userName, email, hashedPassword, admin);
        const token = jwt.sign({ companyName: companyName, companyNo: companyNo, userName: userName, email: email, password: password, admin: admin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
        req.header.authorization = "Bearer" + token;
        console.log(sqlResult);
        obj = {
            msg: "註冊成功",
            token: token
        };
    } else {
        obj = {
            msg: "此email已經有註冊"
        };
    }
    res.send(obj);
}

module.exports = {
    signin,
    register
};
