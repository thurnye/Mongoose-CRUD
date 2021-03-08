const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product', //this sets the relations with the Product in the db
                required:true
                 //ref is used when using embeded doc       
            },
            quantity: {
                type: Number, 
                required: true
            }
        }] //the items will be an array
    },
    order: {
        orders: []
    }
});

//the methods key is an object which allows you to add your oen methods by simply addin them
UserSchema.methods.addToCart = function(product) {
        //here we will add aproduct to the cart
        //find out if the cart contains a certain product
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        })
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex >= 0) {  //this is the new quantity, if the item already exists,  
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;  
            updatedCartItems[cartProductIndex].quantity = newQuantity
        }else {
            //we add the new item if it does not exist
            updatedCartItems.push({
                productId: product._id, 
                quantity: newQuantity
            })
        }
        //adding a product to the cart and adding quantity
        const updatedCart = {
            items: updatedCartItems
        }
        //update the cart
        this.cart = updatedCart
        //update the database
        return this.save()    
}

//we want to Remove  items from the Cart

UserSchema.methods.removeFromCart = function(productId) {
    //the filter method removes item that returns false and keeps items that returns true.
    const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()  //this returns false
    })
    //update the cart items
    this.cart.items = updatedCartItems
    return this.save()
} 

//we want to clear the cart

UserSchema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}


module.exports = mongoose.model('User', UserSchema)