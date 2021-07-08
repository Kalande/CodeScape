const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: "text",
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts:{
    ref: 'Snippet',
    type: [Schema.Types.ObjectId]
  },
  imageUrl: {
    type: String
  },
  following: {
    ref: 'User',
    type: [Schema.Types.ObjectId]
  },
  followers: {
    ref: 'User',
    type: [Schema.Types.ObjectId]
  },
  about: {
    type: String,
  },
  savedsnippets: {
    ref: 'Snippet',
    type: [Schema.Types.ObjectId]
  }
});


const User = model("User", userSchema);

User.createIndexes()

module.exports = User;
