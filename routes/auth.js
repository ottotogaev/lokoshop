const {
  Router
} = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => { // delete session
    res.redirect('/auth/login#login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body
    const candidate = await User.findOne({
      email
    });
    // console.log(candidate);
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) throw err
          res.redirect('/');
        });
      } else {
        req.flash('loginError', 'Неверный пароль');
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'Такого пользователь не существует'); // Неправильный логин или пароль
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    const {
      email,
      name,
      password,
      repeat
    } = req.body;

    const candidate = await User.findOne({
      email
    });
    if (candidate) {
      req.flash('registerError', 'Ползователь с таким эмаилом уже существует')
      res.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: {
          items: []
        }
      });
      await user.save();
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
})
module.exports = router;