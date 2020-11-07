const {
  Router
} = require('express');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', async (req, res) => {
  const products = await Product.find()
    .populate('userId', 'email name')
    .select(`price title img`);

  res.render('products', {
    title: 'Товары',
    isProducts: true,
    products
  });
});

// Edit product get
router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/');
  }
  const product = await Product.findById(req.params.id);
  res.render('product-edit', {
    title: `Edit product ${product.title}`,
    product
  })
});

// Edit product post
router.post('/edit', auth, async (req, res) => {
  const {
    id
  } = req.body
  delete req.body.id;
  await Product.findByIdAndUpdate(id, req.body);
  res.redirect('/products');
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Product.deleteOne({
      _id: req.body.id
    });
    res.redirect('/products');
  } catch (e) {
    console.log(e);
  }
});

// View product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('product', {
    layout: 'empty',
    title: `${product.title}`,
    product
  })
})

module.exports = router