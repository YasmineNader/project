const User = require('../models/user.model')
const Admin = require('../models/admin.model')
const jwt = require('jsonwebtoken')

const userAuth=async(req,res,next)=>{
    try{
        
        const token = req.header('Authorization').replace('bearer','')
        const unhashedToken=jwt.verify(token,process.env.JWTTOKEN)
        user= await User.findOne({_id:unhashedToken._id})
        if(user==null){
            throw new Error ('this is not a User Email ')
        }
        req.user=user
        next()

    }catch(e){
        res.send("you Need to logIn")
    }


}


const adminAuth=async(req,res,next)=>{
    try{
       
        const token = req.header('Authorization').replace('bearer','')
        const undecodecToken=jwt.verify(token,process.env.JWTTOKEN)
        admin= await Admin.findOne({_id:undecodecToken._id})
        if(admin==null){
            throw new Error ('this is not an Admin Email ')
        }
        req.admin=admin
        next()

    }catch(e){
        res.send('You Must Login First')
    }







}


module.exports={userAuth,adminAuth}