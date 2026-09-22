import express from 'express'
import { createReview, getReview } from '../controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.post("/",createReview)
reviewRouter.get("/",getReview)

export default reviewRouter