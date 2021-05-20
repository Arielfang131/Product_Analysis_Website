const router = require("express").Router();

const {
    getContentList
} = require("../controllers/contentlist_controller");

router.route("/contentlist").post(getContentList);

module.exports = router;
