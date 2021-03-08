const mongoose = require('mongoose');

const Schema = mongoose.Schema //this allows us to create new schema;

//in the js obj we pass in the schema instance, there we define how our product will look like
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {  //a prd shld ve a user Id field
    type: Schema.Types.ObjectId, //this references a user
    ref: 'User', //we are referencing to the User model  //dz sets up d relations
    required: true

  }
});

module.exports = mongoose.model('Product', productSchema);