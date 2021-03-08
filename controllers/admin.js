const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};




exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    //the values refers to the data we receive in the controller action, the key refers to the schema in  product.js
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId : req.user
  }) //we map the different values we defined in our schema 
  product.save()   //the save method comes from mongoose, we do not  define it
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};



//EDITING >>>> RESPONSIBLE FOR GETTING THAT PARTICULAR PRODCUT FROM D DB

//Editing a product, this loads the product to the edit page so we could edit it
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
   //if editmode is false redirect to /
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      //if no product to edit redirect to '/'
      if (!product) {
        return res.redirect('/');
      }
      //otherwise we will render the view with our loaded product
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};



//EDITING >>>> RESPONSIBLE FOR POSTING THAT PARTICULAR PRODCUT FROM D DB & RENDERING TO USERS

//this get called onces we submit the edited product 
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
   //here we will find the element in the database which we do want to change
  Product.findById(prodId)
  .then(product => {
    product.title = updatedTitle,
    product.price = updatedPrice,
    product.imageUrl = updatedImageUrl,
    product.description = updatedDesc
    return product.save() //save the product
  })
  .then(result => {
        //this handles any success from the save promise above
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
     //this will catches all promise err                               
    .catch(err => console.log(err));
};




//getting all products from the admin-product
exports.getProducts = (req, res, next) => { 
  Product.find()
  // .select('title price - _id') //allows us to define which field we want to select or unselect(using the -)
  // .populate('userId', 'name') //dz allows us to populate a certain field wit all g details info n nt jst d id      
    .then(products => {
      console.log(products)
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};



//Deleting a product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
