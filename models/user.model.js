const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 20 },
  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid Email");
    },
  },
  password: { type: String, trim: true, required: true },
  tokens: [{ token: { type: String } }],
  phone: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isMobilePhone(value, ["ar-EG"]))
        throw new Error("Invalid phone");
    },
  },
});

// userSchema.methods.toJson=function(){
//   user=this.toObject()
//   deleteItems = ["password"]
//   deleteItems.forEach(item=>{
//     delete user[item]
//   })
// }
userSchema.pre("save", async function (next) {
  try {
    user = this;
    if (user.isModified("password")) {
      user.password = await bcryptjs.hash(user.password, 9);
    }
    next();
  } catch (e) {
    console.log(e.message);
  }
});

userSchema.methods.generateToken = async function () {
  user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTTOKEN);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.virtual("userOrder", {
  ref: "orders", 
  localField: "_id", 
  foreignField: "user_id"
});

const User = new mongoose.model("users", userSchema);
module.exports = User;
