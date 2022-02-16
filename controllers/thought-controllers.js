const { Thought, User } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // add thought to user
  createThought({ params, body}, res) {
    console.log(body);
    Thought.create(body)
    .then(({ _id }) => {
      return User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

  // add a reaction to a thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  // remove a reaction from a thought
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
  },

  // remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(deletedThought => {
      if (!deletedThought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      return User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
    })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  }
};

module.exports = thoughtController;
