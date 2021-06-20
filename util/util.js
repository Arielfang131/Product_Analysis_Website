// env
require("dotenv").config();
const { ACCESS_TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");

const authentication = () => {
    return async function (req, res, next) {
        let accessToken = req.get("Authorization");
        if (!accessToken) {
            res.status(401.1).send({ error: "Unauthorized" });
            return;
        }
        accessToken = accessToken.replace("bearer ", "");
        if (accessToken === "null") {
            res.status(401.1).send({ error: "Unauthorized" });
            return;
        }
        try {
            const user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            req.user = user;
            next();
            return;
        } catch (err) {
            console.log("test25");
            console.log(err);
            res.status(403).send({ error: "Forbidden" });
        }
    };
};

module.exports = {
    authentication
};
