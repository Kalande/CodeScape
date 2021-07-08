const { Schema, model } = require("mongoose");

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
