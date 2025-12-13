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
    slots: [{
        spotId: {
            type: String,
            required: true
        },
        slotNumber: {
            type: String,
            required: true
        },
        vehicleNumber: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true // hours
        },
        totalCost: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
})

export default mongoose.models.user||mongoose.model("user",userSchema,'users');

