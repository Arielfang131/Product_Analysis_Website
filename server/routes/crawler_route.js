const router = require("express").Router();

const {
    main,
    getDcard
} = require("../controllers/crawler_controller");

router.route("/admin/test").get(main);
router.route("/admin/test2").get(getDcard);

module.exports = router;
