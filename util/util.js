// 使用env
require("dotenv").config();
const { ACCESS_TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");

const authentication = (roleId) => {
    return async function (req, res, next) {
        console.log(req.body);
        console.log("ariel");
        let accessToken = req.get("Authorization");
        console.log("accessToken");
        console.log(accessToken);
        if (!accessToken) {
            console.log("test1");
            res.status(401).send({ error: "Unauthorized" });
            return;
        }
        accessToken = accessToken.replace("bearer ", "");
        if (accessToken === "null") {
            console.log("test2");
            res.status(401).send({ error: "Unauthorized" });
            return;
        }
        try {
            const user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            req.user = user;
            console.log("req.user");
            console.log(req.user);
            console.log(roleId);
            // if (roleId == null) {
            //     next();
            // } else {
            //     let userDetail;
            //     if (roleId === User.USER_ROLE.ALL) {
            //         // userDetail = await User.getUserDetail(user.email);
            //     } else {
            //         //  userDetail = await User.getUserDetail(user.email, roleId);
            //     }
            //     if (!userDetail) {
            //         res.status(403).send({ error: "Forbidden" });
            //     } else {
            //         req.user.id = userDetail.id;
            //         req.user.role_id = userDetail.role_id;
            //         next();
            //     }
            // }
            next();
            return;
        } catch (err) {
            console.log("test25");
            console.log(err)
            res.status(403).send({ error: "Forbidden" });
        }
    };
};

module.exports = {
    authentication
};
