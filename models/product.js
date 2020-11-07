const {Schema, model} = require('mongoose');

const productSchema = new Schema({
  title: {
    type: String, // title product
    required: true
  },
  price: {
    type: Number, // price product
    required:true
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId, // id usera
    ref: 'User'
  }
});

productSchema.method('toClient', function(){
  const product = this.toObject();
  product.id = product._id;
  delete product._id;
  return product
})

module.exports = model('Product', productSchema); // model Product
