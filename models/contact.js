import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    subject:{
        type:String,
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now
    }
})

const Contact = mongoose.model("Contact",contactSchema)

export default Contact