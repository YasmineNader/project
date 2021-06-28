const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const user = require("../models/user.model");
const auth = require("../middleware/Auth");
const product = require("../models/product.model");

router.post("/user/AddOrder", auth.userAuth, async (req, res) => {
  try {
    order = new Order(req.body);
    await order.save();

    res.status(200).send("Order Is Done");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/user/ShowAllOrders", auth.userAuth, async (req, res) => {
  try {
    //    await req.user.populate({
    //        path:"userOrder"
    //    }).execPopulate()
    //    res.status(200).send(req.user.userOrder)
    // alldata = await Order.find().populate('user_id',["name","phone"])
    alldata = await Order.find()
      .populate("user_id","name")
      //.populate("products_id");

      // alldata.forEach(async (_products)=>{
      //   _products.products.forEach(async (val,index)=>{
      //post = await product.findById("60d79c933e0c1f128467b2bb").populate('product');
      //     console.log(post);
      //   })        
      // })

    res.status(200).send(alldata);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/user/deleteOrder/:id",auth.userAuth,async (req, res) => {
    try {
        orderId=req.params.id
        order= await Order.findByIdAndDelete({ _id:orderId })
        
         order.save()
      
  
      res.status(200).send("Order Is Deleted");
    } catch (e) {
      res.status(500).send("Order Is already Deleted");
    }
  })


  router.patch("/user/editOrder/:id", auth.userAuth, async (req, res) => {
      
    orderID = req.params.id;
    order = await Order.findById({_id:orderID})
    orderItem=Object.keys(req.body)
    allowedUpdateItems=['products']
    isAvailableItem = orderItem.every(item => {

       return  allowedUpdateItems.includes(item)
    });
    
    
    if(!isAvailableItem){
        res.status(500).send("this Updated Item Not Available");
    }
    try{
    orderItem.forEach(element => {

        order[element] = req.body[element]
        
    });
    await order.save()
    res.status(200).send("order is updated successfully");

}catch(e){
    res.send(e.message)
}
  })
module.exports = router;
