const router = require("express").Router();

const {
    signin,
    register
} = require("../controllers/member_controller");

router.route("/signin").post(signin);
router.route("/register").post(register);

module.exports = router;
