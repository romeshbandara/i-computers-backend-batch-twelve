import Product from "../models/product.js"
import { isAdmin } from "../controllers/userController.js"

export async function createProduct(req,res){

    try{

        if(isAdmin(req)){
            
            const product = new Product(req.body)
            await product.save()
            res.json({message: "Product added successfully!"})

        }else{
            res.status(403).json({ message: "Only admins can add products!" })
            return
        }



    }
    catch(err){
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function getAllProducts(req,res){

    try{
        
        if(isAdmin(req)){
            const products = await Product.find()
            res.json(products)
        }else{
            const products = await Product.find({isAvailable: true})
            res.json(products)
        }


    }catch(err){
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function deleteProduct(req,res){

        const productId = req.params.productId

    try{

        if(isAdmin(req)){
            const product = await Product.findOne({ productId: productId })
            if(product == null){
                res.status(404).json({ message: "Product not found!" })
                return
            }
            await Product.findOneAndDelete({ productId: productId })
            res.json({ message: "Product deleted successfully!" })
        }else{
            res.status(403).json({ message: "Only admins can delete products!" })
            return
        }

    }catch(err){
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function updateProduct(req,res){

    const productId = req.params.productId

    try{

        if(isAdmin(req)){

            const product = await Product.findOne({ productId: productId })
            if(product == null){
                res.status(404).json({ message: "Product not found!" })
                return
            }

            await Product.findOneAndUpdate({ productId: productId }, req.body)
            res.json({ message: "Product updated successfully!" })

        }else{
            res.status(403).json({ message: "Only admins can update products!" })
            return
        }

    }catch(err){
        res.status(500).json({ message: "Internal Server Error" })
    }


}

export async function getProductById(req,res){

    const productId = req.params.productId

    try{

        

            const product = await Product.findOne({ productId: productId })

            if(product == null){
                res.status(404).json({ message: "product not exists!" })
                return
            }else{


                if(product.isAvailable){

                res.json(product)

            }else{

                if(isAdmin(req)){
                    res.json(product)
                }else{
                    res.status(404).json({ message: "Product not found!" })
                }


            }

            }

            

    }catch(err){
        res.status(500).json({ message: "Internal Server Error" })
    }


}
