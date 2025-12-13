import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
    userId: {
        type: String,
        sparse: true // Allows null/undefined values while maintaining uniqueness when present
    },
    slotNumber: {
        type: String,
        required: [true, "slotNumber is required"],
    },
    status: {
        type: String,
        required: [true, "status is required"],
        enum: ["available", "occupied", "reserved"],
    },
    floor: {
        type: Number,
        required: [true, "floor is required"],
    },
    section: {
        type: String,
        required: [true, "section is required"],
    },
    rate: {
        type: Number,
        required: [true, "rate is required"],
    },
    sensor: {
        temperature: {
            type: Number,
            default: 22
        },
        humidity: {
            type: Number,
            default: 45
        },
        lastUpdate: {
            type: Number,
            default: Date.now
        }
    }
})

export default mongoose.models.parking||mongoose.model("parking",parkingSchema,'parkings');

