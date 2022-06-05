var express = require('express');
var router = express.Router();
var Product = require("../models/product");
var checkSessionAuth = require("../middlewares/checkSessionAuth")
/* GET home page. */
router.get('/',async function(req, res, next) {
  let products = await Product.find();
   console.log(req.session.user);
  res.render("products/list",{title:"Products for Sale",products});
});
router.get('/add',checkSessionAuth, async function(req, res, next) {

  res.render("products/add");
});
router.post('/add',async function(req, res, next) {
  let product= new Product(req.body);
  await product.save();

  res.redirect("/products");
});
router.get('/delete/:id',async function(req, res, next) {
//  res.send("ID from url: "+req.params.id);
  let product = await Product.findByIdAndDelete(req.params.id);
  // await product.delete();

  res.redirect("/products");
});
router.get('/edit/:id',async function(req, res, next) {
  //  res.send("ID from url: "+req.params.id);
    let product = await Product.findById(req.params.id);
    // await product.delete();
  
    res.render("products/edit",{product});
  });
  router.post('/edit/:id',async function(req, res, next) {
    //  res.send("ID from url: "+req.params.id);
      let product = await Product.findById(req.params.id);
      // await product.delete();
      product.title = req.body.title
      product.price=req.body.price
      await product.save()
      res.redirect("/products");
    });
    router.get('/cart/:id',async function(req, res, next) {
      
        let product = await Product.findById(req.params.id);
       console.log("add");
        let cart =[]
       if(req.cookies.cart)cart= req.cookies.cart;
       cart.push(product);
       res.cookie("cart",cart)
      
   res.redirect("/products");
      });
      router.get('/cart/remove/:id',async function(req, res, next) {
       let cart =[]
       if(req.cookies.cart)cart= req.cookies.cart;
       cart.splice(
         cart.findIndex(
           (c)=>c._id==req.params.id),1);
       res.cookie("cart",cart)
      
   res.redirect("/cart");
      });
module.exports = router;
