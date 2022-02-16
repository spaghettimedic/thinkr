const router = require('express').Router();
const { addThought, removeThought, addReaction, removeReaction } = require('../../controllers/thought-controllers');

// this route is used to add a comment to a user
router.route('/:userId').post(addThought);

// this route is used to add a reply to a comment or to remove a comment from a user
router
  .route('/:userId/:commentId')
  .put(addReaction)
  .delete(removeThought);

// this route is used to remove a reply from a comment
router
  .route('/:userId/:commentId/:replyId').delete(removeReaction);

module.exports = router;
