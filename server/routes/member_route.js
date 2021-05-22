const router = require("express").Router();

const {
    signin,
    register,
    getProfile
} = require("../controllers/member_controller");

router.route("/signin").post(signin);
router.route("/register").post(register);
router.route("/profile").get(getProfile);

module.exports = router;
