const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorController = require('./controllers/error');
 const User = require('./models/user')


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5e9373fe99889d6b4cc90731')
    .then(user => {
      req.user = user; //we get the user and store it in the req so that we can use it in other routes
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://thurnye:beatrics1992@cluster0-kxiri.mongodb.net/shop?retryWrites=true&w=majority')
.then(() => {
  //we create a user here buf firstly we want to check if user exist, if not we create one
  User.findOne()
  .then(user => {
    if (!user){
      const user = new User({
        name: 'Daniel',
        email: 'dan@gmail.com',
        cart: {
          items: []
        }
      });
      user.save()
    }
  })
  app.listen(3001)
})
.catch(err => console.log(err))