const {
  Router
} = require('express');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
  res.render('add', {
    title: 'Add product',
    isAdd: true
  });
});

router.post('/', auth, async (req, res) => {
  // const product = await new Product(req.body.title, req.body.price, req.body.img)
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user
  });

  try {
    await product.save()
    res.redirect('/products');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;