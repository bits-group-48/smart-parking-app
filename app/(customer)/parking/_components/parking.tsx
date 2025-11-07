"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ParkingSpot from "./parking-spots";
//import { mockParkingSpots, ParkingSpot as ParkingSpotType } from "@/data/mockParkingData";
import { Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

const Parking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useRouter()


  const filteredSpots = mockParkingSpots.filter((spot) => {
    const matchesSearch = spot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFloor = floorFilter === "all" || spot.floor.toString() === floorFilter;
    const matchesStatus = statusFilter === "all" || spot.status === statusFilter;
    return matchesSearch && matchesFloor && matchesStatus;
  });

  const handleBookSpot = (spot: ParkingSpotType) => {

    navigate.push(`/book/${spot.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Parking Spots</h1>
        </div>

        {/* Filters */}
        <div className="mb-6 grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by slot number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={floorFilter} onValueChange={setFloorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSpots.length} of {mockParkingSpots.length} parking spots
          </p>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Parking Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSpots.map((spot) => (
            <ParkingSpot 
              key={spot.id} 
              spot={spot} 
              onBook={handleBookSpot}
            />
          ))}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No parking spots found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export type ParkingStatus = "available" | "occupied" | "reserved";

export interface ParkingSpotType {
  id: string;
  slotNumber: string;
  status: ParkingStatus;
  floor: number;
  section: string;
  rate: number; // per hour
  sensor: {
    temperature: number;
    humidity: number;
    lastUpdate: string;
  };
}

export interface Booking {
  id: string;
  spotId: string;
  slotNumber: string;
  userId: string;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  duration: number; // hours
  totalCost: number;
  status: "active" | "completed" | "cancelled";
}

// Mock parking spots data
export const mockParkingSpots: ParkingSpotType[] = [
  // Floor 1, Section A
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `spot-1a-${i + 1}`,
    slotNumber: `A${String(i + 1).padStart(2, "0")}`,
    status: (i % 3 === 0 ? "occupied" : i % 5 === 0 ? "reserved" : "available") as ParkingStatus,
    floor: 1,
    section: "A",
    rate: 5,
    sensor: {
      temperature: 22 + Math.random() * 3,
      humidity: 45 + Math.random() * 10,
      lastUpdate: new Date().toISOString(),
    },
  })),
  // Floor 1, Section B
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `spot-1b-${i + 1}`,
    slotNumber: `B${String(i + 1).padStart(2, "0")}`,
    status: (i % 4 === 0 ? "occupied" : i % 6 === 0 ? "reserved" : "available") as ParkingStatus,
    floor: 1,
    section: "B",
    rate: 5,
    sensor: {
      temperature: 22 + Math.random() * 3,
      humidity: 45 + Math.random() * 10,
      lastUpdate: new Date().toISOString(),
    },
  })),
  // Floor 2, Section A
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `spot-2a-${i + 1}`,
    slotNumber: `A${String(i + 1).padStart(2, "0")}`,
    status: (i % 5 === 0 ? "occupied" : i % 7 === 0 ? "reserved" : "available") as ParkingStatus,
    floor: 2,
    section: "A",
    rate: 4,
    sensor: {
      temperature: 21 + Math.random() * 3,
      humidity: 45 + Math.random() * 10,
      lastUpdate: new Date().toISOString(),
    },
  })),
  // Floor 2, Section B
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `spot-2b-${i + 1}`,
    slotNumber: `B${String(i + 1).padStart(2, "0")}`,
    status: (i % 3 === 0 ? "occupied" : "available") as ParkingStatus,
    floor: 2,
    section: "B",
    rate: 4,
    sensor: {
      temperature: 21 + Math.random() * 3,
      humidity: 45 + Math.random() * 10,
      lastUpdate: new Date().toISOString(),
    },
  })),
];

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    spotId: "spot-1a-1",
    slotNumber: "A01",
    userId: "user-1",
    vehicleNumber: "ABC-1234",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration: 4,
    totalCost: 20,
    status: "active",
  },
  {
    id: "booking-2",
    spotId: "spot-1b-5",
    slotNumber: "B05",
    userId: "user-1",
    vehicleNumber: "XYZ-5678",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    duration: 4,
    totalCost: 20,
    status: "completed",
  },
  {
    id: "booking-3",
    spotId: "spot-2a-3",
    slotNumber: "A03",
    userId: "user-1",
    vehicleNumber: "ABC-1234",
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
    duration: 2,
    totalCost: 8,
    status: "completed",
  },
];

export const getParkingStats = () => {
  const total = mockParkingSpots.length;
  const available = mockParkingSpots.filter((s) => s.status === "available").length;
  const occupied = mockParkingSpots.filter((s) => s.status === "occupied").length;
  const reserved = mockParkingSpots.filter((s) => s.status === "reserved").length;

  return {
    total,
    available,
    occupied,
    reserved,
    occupancyRate: ((occupied + reserved) / total) * 100,
  };
};

export default Parking;
