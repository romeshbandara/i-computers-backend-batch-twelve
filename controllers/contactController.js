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
            return res.status(401).json({ message: "You need to login to view your messages" })
        }

        const pageSizeInString = req.params.pageSize || "10"
        const pageNumberInString = req.params.pageNumber || "1"
        const pageSize = parseInt(pageSizeInString)
        const pageNumber = parseInt(pageNumberInString)
        const search = req.query.search ? req.query.search.trim() : ""

        if (pageNumber < 1) {
            return res.status(400).json({ message: "Page number cannot be less than 1" })
        }

        let searchFilter = {}
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const searchRegex = new RegExp(escapedSearch, "i")
            searchFilter = {
                $or: [
                    { name: searchRegex },
                    { email: searchRegex },
                    { subject: searchRegex },
                    { message: searchRegex }
                ]
            }
        }

        if (isAdmin(req)) {
            const filter = search ? searchFilter : {}
            const totalMessageCount = await Contact.countDocuments(filter)
            const totalPages = Math.ceil(totalMessageCount / pageSize) || 1

            const pagesNeededToBeSkipped = pageNumber - 1
            const itemsNeededToBeSkipped = pagesNeededToBeSkipped * pageSize

            const messages = await Contact.find(filter).sort({ time: -1, date: -1, _id: -1 }).skip(itemsNeededToBeSkipped).limit(pageSize)
            return res.json({ messages: messages, totalPages: totalPages, totalCount: totalMessageCount, currentPage: pageNumber })
        } else {
            const filter = search
                ? { $and: [{ email: req.user.email }, searchFilter] }
                : { email: req.user.email }

            const totalMessageCount = await Contact.countDocuments(filter)
            const totalPages = Math.ceil(totalMessageCount / pageSize) || 1

            const pagesNeededToBeSkipped = pageNumber - 1
            const itemsNeededToBeSkipped = pagesNeededToBeSkipped * pageSize

            const messages = await Contact.find(filter).sort({ time: -1, date: -1, _id: -1 }).skip(itemsNeededToBeSkipped).limit(pageSize)
            return res.json({ messages: messages, totalPages: totalPages, totalCount: totalMessageCount, currentPage: pageNumber })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}