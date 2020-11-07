const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash')
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
// Routes 
const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const cardRoute = require('./routes/card');
const ordersRoute = require('./routes/orders');
const productsRoute = require('./routes/products');
const authRoute = require('./routes/auth');
// middlewares
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
// const User = require('./models/user');
const app = express();

// config Handlebars
const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');
// Config uri
dotenv.config({
  path: './config/.env'
});
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions'
})

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById('5f784f48b3669039fc02343c');
//     req.user = user;
//     next()
//   } catch (e) {
//     console.log(e);
//   }
// })

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: false
}));
            // Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store 
}));
app.use(csrf());
app.use(flash());
            // Middlewares
app.use(varMiddleware);
app.use(userMiddleware);
app.use('/', homeRoute);
app.use('/add', addRoute);
app.use('/products', productsRoute);
app.use('/card', cardRoute);
app.use('/orders', ordersRoute);
app.use('/auth', authRoute);

app.use('/*', (req, res) => {
  res.status(404).render('404Page', {
    title: '404'
  })
})

async function start() {
  try {
    const port = process.env.PORT || 5000;
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    // const candidate = await User.findOne();
    // if(!candidate) {
    //   const user = new User({
    //     email: 'user1@gmai.com',
    //     name: 'user1',
    //     cart: {items: []}
    //   })
    //   await user.save();
    // }

    app.listen(port, () => {
      console.log(`App listening on port ${port}!`);
    });
  } catch (e) {
    console.log('Catch Error: ', e);
  }
}

start();