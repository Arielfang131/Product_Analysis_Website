// env
require("dotenv").config();
// hash
const bcrypt = require("bcrypt");
// jsonwebtoken
const jwt = require("jsonwebtoken");
const memberModel = require("../models/member_model.js");

async function signin (req, res) {
    try {
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
                const userInfo = await memberModel.selectUserInfo(email);
                const token = jwt.sign({ companyName: userInfo[0].company_name, companyNo: userInfo[0].company_number, userName: userInfo[0].user_name, email: userInfo[0].email, password: userInfo[0].password, admin: userInfo[0].admin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
                req.header.authorization = "Bearer " + token;
                obj = {
                    msg: "登入成功",
                    token: token
                };
            } else {
                obj = {
                    msg: "密碼錯誤"
                };
            }
        }
        res.send(obj);
        return;
    } catch (err) {
        console.log("test35");
        console.log("error: " + err);
        const obj = {
            msg: "wrong"
        };
        res.send(obj);
    }
}

async function register (req, res) {
    try {
        const companyName = req.body.companyName;
        const companyNo = req.body.companyNo;
        const userName = req.body.userName;
        const email = req.body.email;
        const password = req.body.password;
        const admin = req.body.admin;
        let obj = {};
        // Regular expression Testing
        const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        // validate email is ok or not
        if (email.search(emailRule) === -1) {
            obj = {
                msg: "email格式不符"
            };
            res.send(obj);
            return;
        }
        if (/^\d+$/.test(companyNo) === false) {
            obj = {
                msg: "公司統編只能為數字"
            };
            res.send(obj);
            return;
        };
        const regex = new RegExp("[!@#$%^&*(),.?\":{}|<>]");
        if (regex.test(companyName) || regex.test(companyNo) || regex.test(userName)) {
            res.status(401).send("請勿包含特殊字元");
            return;
        }
        const checkEmail = await memberModel.selectEmail(email);
        if (checkEmail.length === 0) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const result = await memberModel.registerMember(companyName, companyNo, userName, email, hashedPassword, admin);
            if (result === {}) {
                obj = {
                    msg: "註冊失敗"
                };
                return;
            }
            const token = jwt.sign({ companyName: companyName, companyNo: companyNo, userName: userName, email: email, password: password, admin: admin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
            req.header.authorization = "Bearer " + token;
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
        return;
    } catch (err) {
        console.log("test36");
        console.log("error: " + err);
        const obj = {
            msg: "wrong"
        };
        res.send(obj);
    }
}

async function getProfile (req, res) {
    try {
        const tokenInfo = req.headers.authorization;
        const token = tokenInfo.split(" ")[1];
        const decodeToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
        let obj = {};
        if (decodeToken === null) {
            obj = {
                msg: "null"
            };
        } else {
            obj = {
                companyName: decodeToken.companyName,
                companyNo: decodeToken.companyNo,
                userName: decodeToken.userName,
                email: decodeToken.email,
                admin: decodeToken.admin
            };
        }
        res.send(obj);
        return;
    } catch (err) {
        console.log("test37");
        console.log("error: " + err);
        const obj = {
            msg: "wrong"
        };
        res.send(obj);
    }
}

module.exports = {
    signin,
    register,
    getProfile
};
