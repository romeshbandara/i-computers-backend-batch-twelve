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
    },
    userImage:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        required:true
    }

})

const Review = mongoose.model("Review", reviewSchema)

export default Review