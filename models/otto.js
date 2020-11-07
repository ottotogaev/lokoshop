const {Schema, model} = require('moongose');

const ottoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: true
  }
})

module.exports = model('Otto', ottoSchema);