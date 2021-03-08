//ctrls helps us to tell the view file what to render on the web

const Product = require('../models/product');

const Order = require('../models/order')


//we want to get all the products
exports.getProducts = (req, res, next) => {
    //to get all the datas for this model
  Product.find() //the find in mongoose just gives us all the products automatically without the cursor
    .then(products => {
      console.log(products)
        //onces the data is gotten we render the page instead.
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};


//we want to get a single product by an Id                    //SINGLE PRODUCT
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};




//this is the front page
exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
          //onces the data is gotten we render the page instead.
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// //in the cart i want to use the cart associated with my existing user to get all the products in it and render it to the screen in the cart

exports.getCart = (req, res, next) => {
  //console.log(req.user.cart)
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user =>{
    const products = user.cart.items
   //we should have the products that are in the carts so we can now render them
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    }
  )
  .catch(err => console.log(err))
};



//resposible for posting the product in the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(result => {
    console.log(result)
    res.redirect('/cart');
  })
  .catch(err => console.log(err))

}


//Deleting items from carts
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .removeFromCart(prodId)
  .then(result => {
    res.redirect('/cart');
  })
  .catch( err => console.log(err))
};

exports.postOrder = (req, res, next) => { //we get the product n user according to how it is defined in orders
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user =>{
    console.log(user.cart.items)
    const products = user.cart.items.map(i => {
      return {
        quantity: i.quantity, 
        product: {...i.productId._doc} //_doc a mongoose method that allows us to get  access to just the data we need in the productId
      }
    })
    const order = new Order({
      user:{
        name: req.user.name,
        userId: req.user
      },
      products: products
    })
    return order.save()
  })
  .then(result => {
    return req.user.clearCart(); 
  })
  .then((result) => {
    res.redirect('/orders')
  })
  .catch(err => console.log(err))
}


exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id}) //where the userID in the order is equal to the login in user
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err))
};


