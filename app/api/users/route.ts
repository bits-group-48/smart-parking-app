import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db-config";
import User from "@/schema/userModel";

// GET - Fetch all users
export async function GET(request: NextRequest) {
    try {
        await connect();

        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        // Transform data to match frontend format
        const formattedUsers = users.map((user) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.mobile, // Map mobile to phone
            registeredDate: user.createdAt 
                ? new Date(user.createdAt).toISOString()
                : new Date().toISOString(), // Fallback to current date if createdAt doesn't exist
            totalBookings: user.slots?.length || 0, // Count bookings from slots array
            status: (user.slots?.length || 0) > 0 ? "active" : "active" as "active" | "inactive", // Default to active
            vehicleNum: user.vehicleNum,
            userId: user.userId || user.email,
        }));

        return NextResponse.json(
            { 
                success: true,
                data: formattedUsers
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}

