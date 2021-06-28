const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = new mongoose.Schema({
  name: { type: String, trim: true, unique: true, required: true },
  category: { type: String, enum: ["men", "women", "kids"], required: true },
  brand: { type: String, trim: true, required: true },
  color: { type: String, trim: true },

  price: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (!validator.isInt(value)) throw new Error("invalid Price");
    },
  },
  
  stock: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (!validator.isInt(value)) throw new Error("invalid stock");
    },
  },

  image: { type: String },
});

productSchema.methods.toJSON = function () {
  var productdata = this.toObject();
  deleteItems = ["__v", "_id"];
  deleteItems.forEach((item) => {
    delete productdata[item];
  });
  return productdata;
};

// productSchema.virtual("productOrder",{
//   ref:'orders',
//   localField:'_id',
//   foreignField:'products_id'
// })

const product = new mongoose.model("products", productSchema);
module.exports = product;
