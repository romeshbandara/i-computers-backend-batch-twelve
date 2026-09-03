import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export async function createUser(req, res) {


    try {

        const password = req.body.password;

        const passwordHash = bcrypt.hashSync(password, 10);

        const user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        });
        await user.save();
        res.json({ message: "User saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving user", error: error.message });
    }

}

export async function loginUser(req, res) {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email })

        if (user == null) {
            res.status(404).json({ message: "User not found" })
            return
        }

        const isPasswordMatching = bcrypt.compareSync(password, user.password)

        if (isPasswordMatching) {


            const userInfo = {

                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                emailVerified: user.isEmailVerified,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked
            }

            const token = jwt.sign(userInfo, process.env.JWT_SECRET)

            res.json({ token: token, isAdmin: user.isAdmin })

        } else {
            res.status(401).json({ message: "Invalid password" })
        }

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message })
    }


}




export function isAdmin(req) {

    if (req.user == null) {
        return false
    }
    if (!req.user.isAdmin) {
        return false
    }
    return true
}

export async function getAllUsers(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({ message: "Only admins can view all users!" })
        return
    }

    const pageSizeInString = req.params.pageSize || "10" //string "3"

    const pageNumberInString = req.params.pageNumber || "1" //string "3"

    const pageSize = parseInt(pageSizeInString) //int 3

    const pageNumber = parseInt(pageNumberInString) //int 3

    try {



        const totalUserCount = await User.countDocuments()

        const totalPages = Math.ceil(totalUserCount / pageSize)

        if (pageNumber < 1) {
            return res.status(400).json({ message: "Page number cannot be less than 1" })
        }

        const pagesNeededToBeSkipped = pageNumber - 1

        const itemsNeededToBeSkipped = pagesNeededToBeSkipped * pageSize

        const users = await User.find().skip(itemsNeededToBeSkipped).limit(pageSize)
        return res.json({ users: users, totalPages: totalPages, totalCount: totalUserCount, currentPage: pageNumber })


    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function updateUserStatus(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ message: "Only admins can update user status!" })
        return false
    }

    try {

        const email = req.body.email
        const isBlocked = req.body.isBlocked




        if (email == req.user.email) {
            res.status(400).json({ message: "Admin cannot update their own status!" })
            return false
        }

        const user = await User.findOne({ email: email })


        if (user == null) {
            res.status(404).json({ message: "User not found" })
            return false
        }

        await user.updateOne({ isBlocked: isBlocked })
        res.json({ message: "User status updated successfully" })

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function updateUserRole(req, res) {

    const email = req.body.email
    const admin = req.body.isAdmin

    if (email == req.user.email) {
        res.status(400).json({ message: "Admin cannot update their own role!" })
        return false
    }
    if (!isAdmin(req)) {
        res.status(403).json({ message: "Only admins can update user role!" })
        return false
    }
    const user = await User.findOne({ email: email })
    if (user == null) {
        res.status(404).json({ message: "User not found" })
        return false
    }
    await user.updateOne({ isAdmin: admin })
    res.json({ message: "User role updated successfully" })
}

export async function getCurrentUser(req, res) {
    if (req.user == null) {
        res.status(404).json({ message: "User not found" })
        return
    }
    try {
        const user = await User.findOne({ email: req.user.email })
        if (user == null) {
            res.status(404).json({ message: "User not found" })
            return
        }
        res.json({ user: user })
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

