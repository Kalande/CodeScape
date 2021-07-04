const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: "text"
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
  }
});


const User = model("User", userSchema);

module.exports = User;
