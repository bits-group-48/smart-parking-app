import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values while maintaining uniqueness
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
        required:[true,"Email is required"],
        unique: true
    },
    vehicleNum:{
        type:String,
        required:[true,"Vehicle number is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required" ]
    },
    slots:[]
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
})

export default mongoose.models.user||mongoose.model("user",userSchema,'users');

