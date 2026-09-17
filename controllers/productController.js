import Product from "../models/product.js"
import { isAdmin } from "../controllers/userController.js"
import { raw } from "express"

export async function createProduct(req, res) {

    try {

        if (isAdmin(req)) {

            const product = new Product(req.body)
            await product.save()
            res.json({ message: "Product added successfully!" })

        } else {
            res.status(403).json({ message: "Only admins can add products!" })
            return
        }



    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message })
    }

}

export async function getAllProducts(req, res) {



    try {

        if (isAdmin(req)) {
            const products = await Product.find()
            res.json(products)
        } else {
            const products = await Product.find({ isAvailable: true })
            res.json(products)
        }


    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function deleteProduct(req, res) {

    const productId = req.params.productId

    try {

        if (isAdmin(req)) {
            const product = await Product.findOne({ productId: productId })
            if (product == null) {
                res.status(404).json({ message: "Product not found!" })
                return
            }
            await Product.findOneAndDelete({ productId: productId })
            res.json({ message: "Product deleted successfully!" })
        } else {
            res.status(403).json({ message: "Only admins can delete products!" })
            return
        }

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function updateProduct(req, res) {

    const productId = req.params.productId

    try {

        if (isAdmin(req)) {

            const product = await Product.findOne({ productId: productId })
            if (product == null) {
                res.status(404).json({ message: "Product not found!" })
                return
            }

            await Product.findOneAndUpdate({ productId: productId }, req.body)
            res.json({ message: "Product updated successfully!" })

        } else {
            res.status(403).json({ message: "Only admins can update products!" })
            return
        }

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }


}

export async function getProductById(req, res) {

    const productId = req.params.productId

    try {



        const product = await Product.findOne({ productId: productId })

        if (product == null) {
            res.status(404).json({ message: "product not exists!" })
            return
        } else {


            if (product.isAvailable) {

                res.json(product)

            } else {

                if (isAdmin(req)) {
                    res.json(product)
                } else {
                    res.status(404).json({ message: "Product not found!" })
                }


            }

        }



    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }


}

export async function searchProducts(req, res) {
    try {
        const rawQuery = req.params.query;

        // 1. Split search query into individual words (e.g. ["gaming", "motherboard"])
        const words = rawQuery.trim().split(/\s+/);

        // 2. Build a flexible regex for each word to allow optional internal spaces (e.g. "a\\s*s\\s*u\\s*s")
        const wordRegexes = words.map(word =>
            word.split("").join("\\s*")
        );

        

        // 3. Match documents where EVERY word exists in at least one of the fields
        const products = await Product.find({
            $and: wordRegexes.map(regex => ({
                $or: [
                    { name: { $regex: regex, $options: "i" } },
                    { description: { $regex: regex, $options: "i" } },
                    { altNames: { $regex: regex, $options: "i" } },
                    { category: { $regex: regex, $options: "i" } }
                ]
            }))
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function filterProducts(req,res){
    try {
       const rawQuery = req.params.category;

        // 1. Split search query into individual words (e.g. ["gaming", "motherboard"])
        const words = rawQuery.trim().split(/\s+/);

        // 2. Build a flexible regex for each word to allow optional internal spaces (e.g. "a\\s*s\\s*u\\s*s")
        const wordRegexes = words.map(word =>
            word.split("").join("\\s*")
        );

        

        // 3. Match documents where EVERY word exists in at least one of the fields
        const products = await Product.find({
            $and: wordRegexes.map(regex => ({
                $or: [
                    
                    { category: { $regex: regex, $options: "i" } }
                ]
            }))
        });
        res.json(products)
    } catch (err) {
        return res.status(500).json({message:"Internal server error",error:err.message})
    }
}