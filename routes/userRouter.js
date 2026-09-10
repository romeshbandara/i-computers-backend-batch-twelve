import express from "express";
import { createUser, getAllUsers, getCurrentUser, updateUserPassword, updateUserProfile, updateUserRole, updateUserStatus } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";


const userRouter = express.Router()

userRouter.post("/", createUser)

userRouter.post("/login", loginUser)

userRouter.get("/:pageSize/:pageNumber", getAllUsers)

userRouter.put("/status",updateUserStatus)

userRouter.put("/role", updateUserRole)

userRouter.get("/me", getCurrentUser)

userRouter.put("/profile", updateUserProfile)

userRouter.put("/password", updateUserPassword)



export default userRouter