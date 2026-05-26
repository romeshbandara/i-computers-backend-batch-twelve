import express from "express";
import { createStudents } from "../controllers/studentController.js";


const studentRoute = express.Router()

studentRoute.post( "/" , createStudents)

export default studentRoute