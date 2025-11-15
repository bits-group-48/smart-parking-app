import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, MapPin, Clock, TrendingUp } from "lucide-react";


const Dashboard = () => {
  const stats = getParkingStats();
  const activeBooking = mockBookings.find((b) => b.status === "active");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Spots
              </CardTitle>
              <MapPin className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.available}</div>
              <p className="text-xs text-muted-foreground">
                Out of {stats.total} total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Occupied
              </CardTitle>
              <Car className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.occupied}</div>
              <p className="text-xs text-muted-foreground">
                Currently in use
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reserved
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.reserved}</div>
              <p className="text-xs text-muted-foreground">
                Pre-booked spots
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Occupancy Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.occupancyRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current usage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Booking */}
        {activeBooking && (
          <Card className="mb-8 shadow-elevated border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Active Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Slot Number</p>
                  <p className="text-2xl font-bold">{activeBooking.slotNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="text-lg font-semibold">{activeBooking.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p className="font-medium">
                    {new Date(activeBooking.startTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Time</p>
                  <p className="font-medium">
                    {new Date(activeBooking.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/bookings">View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Button asChild className="h-24">
              <Link href="/parking" className="flex flex-col gap-2">
                <MapPin className="h-6 w-6" />
                <span>View All Spots</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24">
              <Link href="/bookings" className="flex flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span>My Bookings</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24">
              <Link href="/profile" className="flex flex-col gap-2">
                <Car className="h-6 w-6" />
                <span>Profile</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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

const mockBookings: Booking[] = [
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
 const getParkingStats = () => {
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

export default Dashboard;


