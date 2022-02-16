const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controllers');

// this route will get all thoughts
router.route('/')
  .get(getAllThoughts);

// this route creates a thought (must be associated with a user so userId is required)
router.route('/:userId')
.post(createThought); // new thoughts are pushed to their respective user in the api call

// this route gets a single thought, updates a thought, and deletes a though by its id
router.route('/:userId/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);

// this route is used to create a reaction for a thought
router
  .route('/:id/reactions')
  .post(addReaction);

  // this route deletes a reatction from a thought
router
  .route('/:id/reactions/:reactionId')
  .delete(removeReaction);

module.exports = router;
