const Product = require("../models/product.model");
const cloudinary = require("../utils/cloudinary")
const fs = require("fs")
exports.creteProduct=async(req,res)=>{
    try {
        const { name, description ,  price , stock , } = req.body;
    
        if (!name || !description || !price || !stock) {
          return res.status(400).json({
            success: false,
            message: "All fields  are required"
          });
        }
    
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Image file is required"
          });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'Product',
          timeout: 60000
        });
        const productadd = new Product({
          name,
           description,
           price,
           stock,
          image: result.secure_url,
          cloudinary_id: result.public_id,
          
        });
    
        await productadd.save();
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          } else {
            console.log("File deleted from server.");
          }
        });
    
        return res.status(200).json({
          success: true,
          message: 'product successfully added',
        });
    
      } catch (error) {
        console.error('Error:', error.response || error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
}
//get product 
exports.GetAllProduct= async(req,res)=>{
    try {
        const find= await Product.find()
        if(find){
            return res.status(200).json({
                success:true,
                Product:find
            })
        }
    } catch (error) {
        console.error('Error:', error.response || error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
    }
}

//get ByID 
exports.GetIdProduct= async(req,res)=>{
    try {
        const find= await Product.findById(req.params.id)
        if(find){
            return res.status(200).json({
                success:true,
                Product:find
            })
        }
    } catch (error) {
        console.error('Error:', error.response || error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
    }
}

//delete product
exports.DeleteProduct= async(req,res)=>{
    try {
        const find= await Product.findById(req.params.id)
        if(!find){
            return res.status(200).json({
                success:true,
                message:"Product not find"
            })
        }
        await cloudinary.uploader.destroy(find.cloudinary_id);
        console.log(find.cloudinary_id);
        await find.deleteOne();
        res.json({
          success: true,
          message: "product is deleted"
        })
    } catch (error) {
        console.error('Error:', error.response || error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
    }
}

//update product
exports.UpdateProduct= async(req,res)=>{
    let product = await Product.findById(req.params.id);

    // Check if the Event is found
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    await cloudinary.uploader.destroy(product.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Product',
        timeout: 60000
      });
    }
    const data = {
      name: req.body.name,
      description:req.body.deleteOne,
      price:req.body.price,
      stock:req.body.stock,
      image: result?.secure_url,
      cloudinary_id: result?.public_id,
    };
    product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      success: true,
      message: "product Is  Updated"
    });
}
//check stock in alert box
exports.checkStock = async (req, res) => {
    try {
      const products = await Product.find({ stock: { $lt: 5 } }); // Find low-stock products
      res.json({ message: "Low-stock products", products });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };