const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs=require('bcryptjs')
const jwt = require('jsonwebtoken')
const adminSchema = new mongoose.Schema({

    name:{type:String,trim:true,required:true,maxlength:20},
    email:{type:String,unique:true,required:true,
    validate(value){if(!validator.isEmail(value)) 
    throw new Error ('Invalid Email')}},
    password:{type:String,trim:true,required:true},
    tokens:[{token:{type:String}}]
    })


    adminSchema.pre('save',async function(next){
        try{
        admin=this
        if(admin.isModified('password')){
            admin.password=await bcryptjs.hash(admin.password,9)
        }
        next()
    }
    catch(e){
        console.log(e.message)
    }
    })      
   
adminSchema.methods.generateToken=async function(){
 admin=this
 const token =jwt.sign({_id:admin._id.toString()},process.env.JWTTOKEN)
 admin.tokens=admin.tokens.concat({token})
 await admin.save()
 return token

}




const Admin = new mongoose.model('Admins',adminSchema)
module.exports=Admin