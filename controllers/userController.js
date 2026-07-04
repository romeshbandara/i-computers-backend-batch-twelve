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
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : passwordHash
        });
        await user.save();
        res.json({ message: "User saved successfully" });
    }catch (error) {
        res.status(500).json({ message: "Error saving user", error: error.message });
    }

}

export async function loginUser(req, res) {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email : email})

        if(user == null){
            res.status(404).json({ message: "User not found" })
            return
        }

        const isPasswordMatching = bcrypt.compareSync(password, user.password)

        if(isPasswordMatching){
            

            const userInfo = {

                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                image : user.image,
                emailVerified : user.isEmailVerified,
                isAdmin : user.isAdmin,
                isBlocked : user.isBlocked
            }

            const token = jwt.sign(userInfo, process.env.JWT_SECRET)

            res.json({ token : token, isAdmin : user.isAdmin})

        }else{
            res.status(401).json({ message: "Invalid password" })
        }

    }catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message })
    }


    }


    

    export function isAdmin(req){
        
        if(req.user == null){
            return false
        }
        if(!req.user.isAdmin){
            return false
        }
        return true
    }

    export async function getAllUsers(req,res){
        try{
            if(isAdmin){
                const users = await User.find()
                res.json(users)
            }
        }catch(err){
            res.json({message : "Failed to load users!", error : err.message})
        }
    }





    