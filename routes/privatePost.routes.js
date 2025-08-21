const { Router } = require("express");
const router = Router();
const {
  createPost,
  deletePost,
  upvotePost,
  addComment,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const moderatorMiddleware = require("../middlewares/moderator.middleware");

app.use(authMiddleware, moderatorMiddleware(["User", "Moderator"]));

router.post("/", createPost);
router.delete("/:postId", deletePost);

router.delete("/:postId/comments", addComment);
router.delete("/:postId/upvote", upvotePost);

module.exports = router;
