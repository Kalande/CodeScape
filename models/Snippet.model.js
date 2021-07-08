const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const snippetSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  programlang: {
    type: String,
  },
  owner: {
    ref: 'User',
    type: Schema.Types.ObjectId
  },
  likes: {
    ref: 'User',
    type: [Schema.Types.ObjectId]
  },
  dislikes: {
    ref: 'User',
    type: [Schema.Types.ObjectId]
  },
  title: {
    type: String,
    required: true,
    index: "text"
  }
});


const Snippet = model("Snippet", snippetSchema);

module.exports = Snippet;
