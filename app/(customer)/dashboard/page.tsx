"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, MapPin, Clock, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

const Dashboard = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [parkingSpots, setParkingSpots] = useState<ParkingSpotType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (sessionStatus === "loading") return;
    
    if (!session?.user) {
      router.push(`/auth?callbackUrl=${encodeURIComponent("/dashboard")}`);
      return;
    }

    // Fetch data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch parking spots
        const parkingResponse = await fetch("/api/parking");
        const parkingData = await parkingResponse.json();
        
        if (!parkingResponse.ok || !parkingData.success) {
          throw new Error(parkingData.error || "Failed to fetch parking spots");
        }

        setParkingSpots(parkingData.data);

        // Fetch user bookings
        const bookingsResponse = await fetch("/api/bookings?status=active");
        const bookingsData = await bookingsResponse.json();
        
        if (!bookingsResponse.ok || !bookingsData.success) {
          throw new Error(bookingsData.error || "Failed to fetch bookings");
        }

        setBookings(bookingsData.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, sessionStatus, router]);

  const getParkingStats = () => {
    if (parkingSpots.length === 0) {
      return {
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
        occupancyRate: 0,
      };
    }

    const total = parkingSpots.length;
    const available = parkingSpots.filter((s) => s.status === "available").length;
    const occupied = parkingSpots.filter((s) => s.status === "occupied").length;
    const reserved = parkingSpots.filter((s) => s.status === "reserved").length;

    return {
      total,
      available,
      occupied,
      reserved,
      occupancyRate: total > 0 ? ((occupied + reserved) / total) * 100 : 0,
    };
  };

  const stats = getParkingStats();
  const activeBooking = bookings.find((b) => b.status === "active");

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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

export default Dashboard;
