const express = require('express')
const Admin = require('../models/admin.model')
const router = express.Router()
const bcryptjs=require('bcryptjs')
const auth = require('../middleware/Auth')
const user = require('../models/user.model')

router.post('/admin/SignUp', async(req,res)=>{
    
    try{

        admin = new Admin(req.body)
        await admin.save()
        res.status(200).send("Admin Now Has Account")
    }catch(e){
        res.status(500).send(e.message)
    }
    
    
    
    })

router.post('/admin/login',async(req,res)=>{
    try{
    adminData=req.body
    admin = await Admin.findOne({email:adminData.email})
    if(admin==null ){
        throw new Error ('Inavlid Email')
    }
    const matchPassword = await bcryptjs.compare(adminData.password,admin.password)
    if( matchPassword==false){
        throw new Error ('Inavlid Password')
   }
   const token = await admin.generateToken()
   res.status(200).send("Now You Are Login")
    }catch(e){
    res.status(500).send(e.message)
}


})

router.post('/admin/logOut',auth.adminAuth,async(req,res)=>{
    req.admin.tokens=[]
    await req.admin.save()
    res.status(200).send("You are Logged Out From All Devices")
})


router.get('/admin/ShowAllUser',auth.adminAuth,async(req,res)=>{
    try{
    users = await user.find()
    
    res.status(200).send(users)
    }catch(e){
        res.status(500).send(e.message)

}
})

router.delete('/admin/deleteUser/:id',auth.adminAuth,async(req,res)=>{
    try{
        id=req.params.id
        User= await user.findByIdAndDelete({_id:id})
        User.save()
    res.status(200).send("User is deleted")
    }catch(e){
        res.status(500).send("User is already deleted")

}
})


module.exports=router