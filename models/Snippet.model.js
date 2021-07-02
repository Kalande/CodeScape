const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const snippetSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
  },
  owner: {
    ref: 'User',
    type: Schema.Types.ObjectId
  }
});


const Snippet = model("Snippet", snippetSchema);

module.exports = Snippet;
