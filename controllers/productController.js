import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate({ path: 'owner', select: 'first_name username email' });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id);
        res.status(200).json({ product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export const getMyProducts = async (req, res) => {
    const { _id } = req.user;
    try {
        const products = await Product.find({ owner: _id }).populate({ path: 'owner', select: 'first_name username email' });
        ;
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const createProduct = async (req, res) => {
    const { _id } = req.user;
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
    }
    const image = req.file.path;


    try {
        const img = await cloudinary.uploader.upload(image);
        const product = await Product.create({
            name,
            description,
            category,
            price,
            image: img.secure_url,
            imageID: img.public_id,
            owner: _id
        })
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export const updateProduct = async (req, res) => {
    const { _id } = req.params;
    const { name, description, price, category } = req.body;
    const image = req.file.path;




    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ error: "Invalid product id" })
        }


        const product = await Product.findById(_id);
        if (product.owner.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: "You are not the owner of this product" })
        }


        if (req.file) {

            await cloudinary.uploader.destroy(product.imageID);

            const img = await cloudinary.uploader.upload(image);

            const updatedProduct = await Product.findByIdAndUpdate(_id, {
                name: name || product.name,
                description: description || product.description,
                category: category || product.category,
                price: price || product.price,
                image: img.secure_url,
                imageID: img.public_id,
            }, { new: true });

            res.status(200).json(updatedProduct);


        } else {
            const updatedProduct = await Product.findByIdAndUpdate(_id, {
                name: name || product.name,
                description: description || product.description,
                category: category || product.category,
                price: price || product.price,
            }, { new: true });
            res.status(200).json(updatedProduct);
        }


    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const { _id } = req.params

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Invalid product id" })
    }
    try {

        const prodOwner = await Product.findById(_id)
        // console.log(prodOwner.owner.toString(), req.user._id.toString())

        if (prodOwner.owner.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: "You are not the owner of this product" })
        }

        const product = await Product.findByIdAndDelete(_id);
        if (!product) {
            return res.status(400).json({ error: "Product not found" })
        }
        await cloudinary.uploader.destroy(product.imageID);
        res.status(200).json({ message: "Product deleted successfully" })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

