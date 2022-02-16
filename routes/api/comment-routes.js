const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controllers');

// this route is used to add a comment to a pizza
router.route('/:pizzaId').post(addComment);

// this route is used to add a reply to a comment or to remove a comment from a pizza
router
  .route('/:pizzaId/:commentId')
  .put(addReply)
  .delete(removeComment);

// this route is used to remove a reply from a comment
router
  .route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;
