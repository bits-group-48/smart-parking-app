import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    userId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

export default mongoose.models.admin || mongoose.model("admin", adminSchema, 'admins');

