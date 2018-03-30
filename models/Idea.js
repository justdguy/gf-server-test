const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  
  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  owner:  { type: Schema.Types.ObjectId, ref: 'User'},
  image: String,
  title: String,
  description: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', IdeaSchema);


