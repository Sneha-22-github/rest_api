const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb://localhost:27017/Sample").then(() => {
    console.log("Connected with Mongodb")
}).catch((err) => {
    console.log(err)
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

const productSchema = new mongoose.Schema({
    name: {type: String, required: [true, "name is required"], min: [6, "six character is required"], unique: true},
    description: String,
    price: Number,
})

const Product = new mongoose.model("Product", productSchema)

app.post("/api/v1/product/new", async (req, res) => {
    const product = await Product.create(req.body);
    return res.status(201).json({
        success: true,
        product
    })

})

app.get("/api/v1/product/get", async (req, res) => {
    const product = await Product.find();
    return res.status(200).json({
        success: true,
        product
    })
})

app.get("/api/v1/product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "product not found"

        })
    }



    return res.status(200).json({
        success: true,
        product
    })
})


app.delete("/api/v1/product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "product not found"

        })
    }

    await Product.findByIdAndDelete(product._id);

    return res.status(204).json({
        success: true,
        message: "product deleted successfully",
        product
    })
})



app.listen(4500, () => {
    console.log("server is working http://localhost:4500")
})