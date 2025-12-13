import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db-config";
import User from "@/schema/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, mobile, vehicleNum, password, confirmPassword } = body;
        console.log(body);
        // Validate input
        if (!name || !email || !mobile || !vehicleNum || !password || !confirmPassword) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate password match
        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Connect to database
        await connect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user (userId will be email, MongoDB _id will be auto-generated)
        const newUser = await User.create({
            userId: email, // Use email as userId
            name,
            email,
            mobile,
            vehicleNum,
            password: hashedPassword,
            slots: []
        });

        // Return user data without password
        const userResponse = {
            id: newUser._id.toString(),
            userId: newUser.userId,
            name: newUser.name,
            email: newUser.email,
            mobile: newUser.mobile,
            vehicleNum: newUser.vehicleNum,
        };

        return NextResponse.json(
            { 
                message: "User created successfully",
                user: userResponse
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

