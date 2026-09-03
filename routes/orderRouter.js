import express from 'express'
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js'

const orderRouter = express.Router()

orderRouter.post("/",createOrder)

orderRouter.get("/:pageSize/:pageNumber",getOrders)

orderRouter.put("/:orderId/:status",updateOrderStatus)

export default orderRouter