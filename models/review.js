import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    commentId: {
        type: String,
        required: true,
        unique:true
    },
    productId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,

    },
    time: {
        type: Date,
        default: Date.now
    },
    image:{
        type:[String],
        default:[]
    }

})

const Review = mongoose.model("Review", reviewSchema)

export default Review