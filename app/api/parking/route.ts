import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db-config";
import Parking from "@/schema/parkingModel";

// GET - Fetch all parking spots
export async function GET(request: NextRequest) {
    try {
        await connect();

        const parkingSpots = await Parking.find({}).sort({ floor: 1, section: 1, slotNumber: 1 });

        // Transform data to match frontend format
        const formattedSpots = parkingSpots.map((spot) => ({
            id: spot._id.toString(),
            slotNumber: spot.slotNumber,
            status: spot.status,
            floor: spot.floor,
            section: spot.section,
            rate: spot.rate,
            sensor: {
                temperature: spot.sensor?.temperature || 22,
                humidity: spot.sensor?.humidity || 45,
                lastUpdate: spot.sensor?.lastUpdate 
                    ? new Date(spot.sensor.lastUpdate).toISOString()
                    : new Date().toISOString(),
            },
            userId: spot.userId || null,
        }));

        return NextResponse.json(
            { 
                success: true,
                data: formattedSpots
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching parking spots:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch parking spots" },
            { status: 500 }
        );
    }
}

// POST - Add a new parking spot
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slotNumber, floor, section, status, rate, temperature, humidity } = body;

        // Validate required fields
        if (!slotNumber || !floor || !section || !status || !rate) {
            return NextResponse.json(
                { error: "Missing required fields: slotNumber, floor, section, status, and rate are required" },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ["available", "occupied", "reserved"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status. Must be one of: available, occupied, reserved" },
                { status: 400 }
            );
        }

        await connect();

        // Check if slot already exists
        const existingSpot = await Parking.findOne({ slotNumber, floor, section });
        if (existingSpot) {
            return NextResponse.json(
                { error: "A parking spot with this slot number, floor, and section already exists" },
                { status: 400 }
            );
        }

        // Create new parking spot
        const newSpot = await Parking.create({
            slotNumber,
            floor: parseInt(floor.toString()),
            section,
            status,
            rate: parseFloat(rate.toString()),
            sensor: {
                temperature: temperature || 22,
                humidity: humidity || 45,
                lastUpdate: Date.now(),
            },
            userId: status === "occupied" ? body.userId : undefined,
        });

        // Return formatted response
        const formattedSpot = {
            id: newSpot._id.toString(),
            slotNumber: newSpot.slotNumber,
            status: newSpot.status,
            floor: newSpot.floor,
            section: newSpot.section,
            rate: newSpot.rate,
            sensor: {
                temperature: newSpot.sensor?.temperature || 22,
                humidity: newSpot.sensor?.humidity || 45,
                lastUpdate: newSpot.sensor?.lastUpdate 
                    ? new Date(newSpot.sensor.lastUpdate).toISOString()
                    : new Date().toISOString(),
            },
            userId: newSpot.userId || null,
        };

        return NextResponse.json(
            { 
                success: true,
                message: "Parking spot created successfully",
                data: formattedSpot
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating parking spot:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create parking spot" },
            { status: 500 }
        );
    }
}

