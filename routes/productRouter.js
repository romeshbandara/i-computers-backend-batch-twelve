import express from "express"
import { createProduct, getAllProducts, deleteProduct, updateProduct, getProductById } from "../controllers/productController.js"


const productRouter = express.Router()

productRouter.post("/", createProduct)

productRouter.get("/", getAllProducts)



productRouter.get("/search", 
    (req,res) => {
        res.json({ message: "Product Searched!" })
    }
)


productRouter.delete("/:productId", deleteProduct)

productRouter.put("/:productId", updateProduct)

productRouter.get("/:productId", getProductById)

export default productRouter