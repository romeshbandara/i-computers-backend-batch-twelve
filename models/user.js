import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

        email : {
            type : String,
            unique : true,
            required : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        isAdmin : {
            type : Boolean,
            required : true,
            default : false
        },
        isBlocked : {
            type : Boolean,
            required : true,
            default : false
        },
        isEmailVerified : {
            type : Boolean,
            required : true,
            default : false
        },
        image : {
            type : String,
            required : true,
            default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }

})

const User = mongoose.model("User" , userSchema)

export default User