import Order from "../models/order.js"
import Product from "../models/product.js"
import { isAdmin } from "./userController.js"

export async function createOrder(req, res) {

    try {
        if (req.user == null) {
            res.status(401).json({ message: "You need to login to create an order" })
            return
        }

        const orderData = {
            orderId: "ORD000001",
            email: req.user.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            postalCode: req.body.postalCode,
            phone: req.body.phone,
            secondaryPhone: req.body.secondaryPhone,
            customerNote: req.body.customerNote,
            totalAmount: 0,
            items: [],

        }

        //validate firstName and lastName

        if (orderData.firstName == null || orderData.firstName == null) {
            orderData.firstName = req.user.firstName
        }
        if (orderData.lastName == null || orderData.lastName == null) {
            orderData.lastName = req.user.lastName
        }

        //validate items one by one
        for (let i = 0; i < req.body.items.length; i++) {

            //productId,qty
            const product = await Product.findOne({ productId: req.body.items[i].productId })

            if (product == null) {
                res.status(400).json({ message: "Product with productId " + req.body.items[i].productId + " does not exists" })
                return
            }
            if (!product.isAvailable) {
                res.status(400).json({ message: "Product with productId " + req.body.items[i].productId + " does not available" })
                return
            }
            // if(product.stock < req.body.items[i].qty){
            //     res.status(400).json({ message: "Product with productId " + req.body.items[i].productId + " does not available" })
            //     return
            // }

            orderData.items.push({
                product: {
                    productId: product.productId,
                    name: product.name,
                    image: product.images[0] || "",
                    price: product.price,

                },
                qty: req.body.items[i].qty
            })

            orderData.totalAmount += product.price * req.body.items[i].qty
        }

        //generate orderId
        const lastOrder = await Order.findOne().sort({ date: -1 })

        if (lastOrder != null) {

            const lastOrderId = lastOrder.orderId // "ORD000026"
            const lastOrderNumberInString = lastOrderId.replace("ORD", "") //"000026"
            const lastOrderNumber = parseInt(lastOrderNumberInString) //26

            const newOrderNumber = lastOrderNumber + 1
            const newOrderNumberInString = newOrderNumber.toString().padStart(6, "0") //"000027"
            orderData.orderId = "ORD" + newOrderNumberInString //"ORD000027"

        }

        //create Order

        const order = new Order(orderData)
        await order.save()
        res.json({ message: "Order Saved!" })

        //update stocks of the products

        // for(let i =0;i<req.body.items.length; i ++){
        //     const product = await Product.updateOne({productId : req.body.items[i].productId},{$inc: {stock:-req.body.items[i].qty}})
        // }




    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function getOrders(req, res) {
    try {

        if (req.user == null) {
            res.status(401).json({ message: "You need to login to view your orders" })
        }

        const pageSizeInString = req.params.pageSize || "10" //"3"

        const pageNumberInString = req.params.pageNumber || "1" //"3"

        const pageSize = parseInt(pageSizeInString) //3

        const pageNumber = parseInt(pageNumberInString) //3

        if (isAdmin(req)) {

            const totalOrderCount = await Order.countDocuments()

            const totalPages = Math.ceil(totalOrderCount / pageSize)

            const pagesNeededToBeSkipped = pageNumber - 1

            const itemsNeededToBeSkipped = pagesNeededToBeSkipped * pageSize

            const orders = await Order.find().sort({ date: -1 }).skip(itemsNeededToBeSkipped).limit(pageSize)
            return res.json({ orders: orders, totalPages: totalPages, totalCount: totalOrderCount })
        } else {

            const totalOrderCount = await Order.countDocuments()

            const totalPages = Math.ceil(totalOrderCount / pageSize)

            const pagesNeededToBeSkipped = pageNumber - 1

            const itemsNeededToBeSkipped = pagesNeededToBeSkipped * pageSize

            const orders = await Order.find({ email: req.user.email }).sort({ date: -1 }).skip(itemsNeededToBeSkipped).limit(pageSize)

            return res.json({ orders: orders, totalPages: totalPages, totalCount: totalOrderCount })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}