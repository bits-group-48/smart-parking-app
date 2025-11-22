import mongoose from "mongoose";
import { type } from "os";
import { boolean } from "zod";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "userId is required"],
        unique:true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    mobile: {
        type: String,
        required: [true, "Mobile is required"],
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    vehicleNum:{
        type:String,
        required:[true,"Vehicle number is required"]
    },
    password:{
        type:String,
        required:[true,"Passwrod is required" ]
    }
})

export default mongoose.models.user||mongoose.model("user",userSchema,'users');

