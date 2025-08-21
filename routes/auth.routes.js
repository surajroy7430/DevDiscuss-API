const { Router } = require("express");
const router = Router();
const { register, login } = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
  runValidtion,
} = require("../middlewares/validdatorMiddlware");

router.post("/register", registerValidation, runValidtion, register);
router.post("/login", loginValidation, runValidtion, login);

module.exports = router;
