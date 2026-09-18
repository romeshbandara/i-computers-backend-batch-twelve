import Contact from "../models/contact.js"
import User from "../models/user.js"
import { isAdmin } from "./userController.js"

export async function sendMessage(req, res) {
    const email = req.body.email
    const user = User.findOne({ email: email })
    if (user == null) {
        return res.status(404).json({ message: "User not found" })
    }
    if (user.isBlocked) {
        return res.status(401).json({ message: "User is blocked" })
    }
    try {
        const message = new Contact({
            email: email,
            name: req.body.name,
            subject: req.body.subject,
            message: req.body.message
        })

        await message.save()
        res.json("Message sent successfully!")
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

export async function getMessage(req, res) {
    // if (!isAdmin(req)) {
    //     return res.status(401).json({ message: "You are not an admin" })
    // }
    // try {
    //     const messages = await Contact.find()
    //     res.json({messages:messages})
    // } catch (err) {
    //     return res.status(500).json({ message: "Internal server error", error: err.message })
    // }

    try {

        if (req.user == null) {
            res.status(401).json({ message: "You need to login to view your orders" })
        }

        const pageSizeInString = req.params.pageSize || "10" //string "3"

        const pageNumberInString = req.params.pageNumber || "1" //string "3"

        const pageSize = parseInt(pageSizeInString) //int 3

        const pageNumber = parseInt(pageNumberInString) //int 3

        if (isAdmin(req)) {



            const totalMessageCount = await Contact.countDocuments()

            const totalPages = Math.ceil(totalMessageCount / pageSize)

            if (pageNumber < 1) {
                return res.status(400).json({ message: "Page number cannot be less than 1" })
            }

            const pagesNeededToBeSkipped = pageNumber - 1

            const itemsNeededToBeSkipped = pagesNeededToBeSkipped * pageSize

            const messages = await Contact.find().sort({ date: -1 }).skip(itemsNeededToBeSkipped).limit(pageSize)
            return res.json({ messages: messages, totalPages: totalPages, totalCount: totalMessageCount, currentPage: pageNumber })
        } else {

            const totalMessageCount = await Contact.countDocuments({ email: req.user.email })
            const totalPages = Math.ceil(totalMessageCount / pageSize)

            if (pageNumber < 1) {
                return res.status(400).json({ message: "Page number cannot be less than 1" })
            }

            const pagesNeededToBeSkipped = pageNumber - 1

            const itemsNeededToBeSkipped = pagesNeededToBeSkipped * pageSize

            const messages = await Contact.find({ email: req.user.email }).sort({ date: -1 }).skip(itemsNeededToBeSkipped).limit(pageSize)

            return res.json({ messages: messages, totalPages: totalPages, totalCount: totalMessageCount })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}