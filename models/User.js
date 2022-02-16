const { Schema, model, SchemaTypes } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const Thought = require('./Thought');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: 'A username is required!',
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address!']
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

//get total count of friends and reactions on retrieval
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// 'cascade' style delete User's associated Thoughts
UserSchema.pre('remove', function(next) {
  Thought.remove({username: this.username}).exec()
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      return res.status(404).json({ message: 'There are no Thoughts associated with this User to delete'});
    }
    res.json(dbThoughtData);
    console.log(this.username + `'s associated Thoughts were succesfully deleted.`);
  });
  next();
});

// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;
