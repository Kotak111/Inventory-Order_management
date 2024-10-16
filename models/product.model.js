const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:
    {
        type: Number,
        required: true
    },

    stock:
    {
        type: Number,
        required: true,
        default: 0 
    },
    image: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String,
    },
    
},{timestamps:true})

ProductSchema.methods.isLowStock = function () {
    return this.stock < 5;  // Define threshold for low stock
  };
  
const Product=model("Product",ProductSchema)
module.exports=Product;