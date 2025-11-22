import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "userId is required"],
        unique:true
    },
    slotNumber: {
        type: String,
    },
    status: {
        type: String,
        required: [true, "District is required"],
    },
    floor: {
        type: Number,
    },
    section: {
        type: String,
    },
    rate: {
        type: Number,
    },
    sensor:{
            temperature: Number,
    humidity: Number,
    lastUpdate: Number,
    }
})

export default mongoose.models.donor||mongoose.model("parking",parkingSchema,'parkings');

