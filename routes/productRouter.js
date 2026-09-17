import express from "express"
import { createProduct, getAllProducts, deleteProduct, updateProduct, getProductById, searchProducts, filterProducts } from "../controllers/productController.js"


const productRouter = express.Router()

productRouter.post("/", createProduct)

productRouter.get("/", getAllProducts)



productRouter.get("/search/:query",searchProducts)


productRouter.delete("/:productId", deleteProduct)

productRouter.put("/:productId", updateProduct)

productRouter.get("/:productId", getProductById)

productRouter.get("/filter/:category",filterProducts)

export default productRouter