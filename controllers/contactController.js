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
    if (!isAdmin(req)) {
        return res.status(401).json({ message: "You are not an admin" })
    }
    try {
        const messages = await Contact.find()
        res.json(messages)
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }

}