const { Router } = require("express");
const router = Router();
const { getPosts, getPostById } = require("../controllers/auth.controller");

router.get("/", getPosts);
router.get("/:postId", getPostById);

module.exports = router;
