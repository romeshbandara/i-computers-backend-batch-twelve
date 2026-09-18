import express from "express"
import { getMessage, sendMessage } from "../controllers/contactController.js"

const contactRouter = express.Router()

contactRouter.post("/message",sendMessage)
contactRouter.get("/message",getMessage)

export default contactRouter