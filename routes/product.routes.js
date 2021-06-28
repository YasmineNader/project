const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const auth = require("../middleware/Auth");
const multer = require("multer");

router.post("/admin/addProducts", auth.adminAuth, async (req, res) => {
  try {
    product = new Product(req.body);
    await product.save();
    res.status(200).send("Product Added Successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/admin/allProducts", auth.adminAuth, async (req, res) => {
  try {
    products = await Product.find();
    res.status(200).send(products);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
router.patch("/admin/editProduct/:id", auth.adminAuth, async (req, res) => {
  productID = req.params.id;
  product = await Product.findById({ _id: productID });
  updateItems = Object.keys(req.body);
  allowedItemToUpdate = ["name", "stock", "price", "brand", "category"];
  isAvailable = updateItems.every((item) => allowedItemToUpdate.includes(item));
  if (!isAvailable) {
    res.status(500).send("this Update Not Available");
  }
  try {
    updateItems.forEach((element) => {
      product[element] = req.body[element];
    });
    await product.save();
    res.status(200).send("Product data Is Updated");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.delete("/admin/deleteProduct/:id", auth.adminAuth, async (req, res) => {
  try {
    productID = req.params.id;
    product = await Product.findByIdAndDelete({ _id: productID });
    product.save();

    res.status(200).send("Product Is Deleted");
  } catch (e) {
    res.status(500).send("Product Is arleady Deleted");
  }
});

const fs = require("fs");
var upload = multer({ dest: "images/" });
router.post(
  "/profile/:id",
  auth.adminAuth,
  upload.single("profile"),
  async (req, res) => {
    try {
      id = req.params.id;
      product = await Product.findById({ _id: id });
      imageWithExtension = `${req.file.path}.${req.file.originalname
        .split(".")
        .pop()}`;
      fs.rename(req.file.path, imageWithExtension, (error) => {
        if (error) console.log(error);
      });
      product.image = imageWithExtension;
      await product.save();
      res.send("image is added");
    } catch (e) {
      res.send(e.message);
    }
  }
);

module.exports = router;
