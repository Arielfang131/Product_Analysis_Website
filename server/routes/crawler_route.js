const router = require("express").Router();

const {
    getPtt
} = require("../controllers/pttcrawler_controller");

const {
    getDcard
} = require("../controllers/dcardcrawler_controller");

router.route("/admin/test").get(getPtt);
router.route("/admin/test2").get(getDcard);

module.exports = router;
