const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.post("/verify-phone", userCtrl.verifyPhone);

router.put("/profile-setup", userCtrl.setupProfile);

router.get("/me", userCtrl.getMe);

module.exports = router;
