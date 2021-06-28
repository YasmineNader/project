const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const bcryptjs=require('bcryptjs')
const auth = require('../middleware/Auth')
const Product = require("../models/product.model");

router.post('/user/SignUp', async(req,res)=>{
    
    try{

        user = new User(req.body)
        await user.save()
        res.status(200).send("User Now Has Account")
    }catch(e){
        res.status(500).send(e.message)
    }
    
    
    
    })

router.post('/user/login',async(req,res)=>{
    try{
    userData=req.body
    user = await User.findOne({email:userData.email})
    if(user==null ){
        throw new Error ('Inavlid Email')
    }
    const matchPassword = await bcryptjs.compare(userData.password,user.password)
    if( matchPassword==false){
        throw new Error ('Inavlid Password')
   }
   const token = await user.generateToken()
   res.status(200).send("Now You Are Login")
    }catch(e){
    res.status(500).send(e.message)
}


})

router.post('/user/logOut',auth.userAuth,async(req,res)=>{
    
    req.user.tokens=[]
    await req.user.save()
    res.status(200).send("You are Logged Out From All Devices")
})


router.get("/user/allProducts",auth.userAuth, async (req, res) => {
    try {
      products = await Product.find();
      res.status(200).send(products);
    } catch (e) {
      res.status(500).send(e.message);
    }
  })

  router.delete('/user/delete',auth.userAuth, async (req, res) => {
    try {
        req.user.remove()
      res.status(200).send("Your Account Is Deleted");
    } catch (e) {
      res.status(500).send(e);
    }
  })

module.exports=router