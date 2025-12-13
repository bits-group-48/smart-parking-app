import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db-config";
import User from "@/schema/userModel";
import Parking from "@/schema/parkingModel";

// GET - Fetch user's bookings
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

        const user = await User.findById(session.user.id);
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get status filter from query params
        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get("status");

        let bookings = user.slots || [];

        // Filter by status if provided
        if (statusFilter) {
            bookings = bookings.filter((booking: any) => booking.status === statusFilter);
        }

        // Format bookings with IDs
        const formattedBookings = bookings.map((booking: any, index: number) => ({
            id: booking._id?.toString() || `booking-${index}`,
            spotId: booking.spotId,
            slotNumber: booking.slotNumber,
            userId: session.user.id,
            vehicleNumber: booking.vehicleNumber,
            startTime: booking.startTime ? new Date(booking.startTime).toISOString() : new Date().toISOString(),
            endTime: booking.endTime ? new Date(booking.endTime).toISOString() : new Date().toISOString(),
            duration: booking.duration,
            totalCost: booking.totalCost,
            status: booking.status || "active",
            createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString() : new Date().toISOString(),
        }));

        return NextResponse.json(
            {
                success: true,
                data: formattedBookings
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { spotId, startTime, endTime, duration, vehicleNumber } = body;

        // Validate required fields
        if (!spotId || !startTime || !endTime || !duration || !vehicleNumber) {
            return NextResponse.json(
                { error: "Missing required fields: spotId, startTime, endTime, duration, and vehicleNumber are required" },
                { status: 400 }
            );
        }

        await connect();

        // Find parking spot
        const parkingSpot = await Parking.findById(spotId);
        
        if (!parkingSpot) {
            return NextResponse.json(
                { error: "Parking spot not found" },
                { status: 404 }
            );
        }

        // Check if spot is available
        if (parkingSpot.status !== "available") {
            return NextResponse.json(
                { error: "Parking spot is not available" },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findById(session.user.id);
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Calculate total cost
        const totalCost = parkingSpot.rate * duration;

        // Create booking object
        const booking = {
            spotId: spotId,
            slotNumber: parkingSpot.slotNumber,
            vehicleNumber: vehicleNumber,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            duration: duration,
            totalCost: totalCost,
            status: "active",
            createdAt: new Date(),
        };

        // Add booking to user's slots array
        user.slots.push(booking);
        await user.save();

        // Update parking spot status to reserved
        parkingSpot.status = "reserved";
        parkingSpot.userId = session.user.id;
        await parkingSpot.save();

        // Format response
        const formattedBooking = {
            id: booking.spotId, // Use spotId as temporary ID
            spotId: booking.spotId,
            slotNumber: booking.slotNumber,
            userId: session.user.id,
            vehicleNumber: booking.vehicleNumber,
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
            duration: booking.duration,
            totalCost: booking.totalCost,
            status: booking.status,
            createdAt: booking.createdAt.toISOString(),
        };

        return NextResponse.json(
            {
                success: true,
                message: "Booking created successfully",
                data: formattedBooking
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating booking:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create booking" },
            { status: 500 }
        );
    }
}

