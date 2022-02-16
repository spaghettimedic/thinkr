const req = require('express/lib/request');
const { User } = require('../models');

const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // get one user by id
  getUserById({ params}, res) {
    User.findOne({ _id: params.id })
    .populate(
      {
        path: 'thoughts',
        select: '-__v'
      }
    )
    .select('-__v')
    .then(dbUserData => {
      // if no user is found, send 404
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // create a new User
  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
  },

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  },

  // delete user -- associated thoughts will be deleted with 'pre' hook in UserSchema (model)
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => res.status(400).json(err));
  },

  // add friend to a user's 'friends' list (array in the User model schema)
  addFriend({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { runValidators: true, new: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No User found with this id!'});
      }
      res.json(dbUserData);
      console.log(body.username + ` successfully added to ` + dbUserData.username + `'s friend list!`)
    })
    .catch(err => {
      res.status(400).json(err);
      console.log(err);
    });
  },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: { friendId: params.friendId } } },
      { runValidators: true, new: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No User found with this id!'});
      }
      res.json(dbUserData);
      console.log('Friend successfully removed from ' + dbUserData.username + `'s friend list!`);
    })
    .catch(err => {
      res.status(404).json(err);
      console.log(err);
    });
  }
};

module.exports = userController;
