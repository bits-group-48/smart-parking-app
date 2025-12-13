import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db-config";
import User from "@/schema/userModel";

// GET - Get current user info
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connect();

        const user = await User.findById(session.user.id).select("-password");
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    vehicleNum: user.vehicleNum,
                    userId: user.userId || user.email,
                }
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch user" },
            { status: 500 }
        );
    }
}

