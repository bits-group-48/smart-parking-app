"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, DollarSign, MapPin, Clock } from "lucide-react";

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

const Bookings = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (sessionStatus === "loading") return;
    
    if (!session?.user) {
      router.push(`/auth?callbackUrl=${encodeURIComponent("/bookings")}`);
      return;
    }

    // Fetch bookings
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/bookings");
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch bookings");
        }

        setBookings(data.data || []);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [session, sessionStatus, router]);

  const activeBookings = bookings.filter((b) => b.status === "active");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-xl">{booking.slotNumber}</p>
              <p className="text-sm text-muted-foreground">{booking.vehicleNumber}</p>
            </div>
          </div>
          <Badge
            className={
              booking.status === "active"
                ? "bg-success text-success-foreground"
                : "bg-muted text-muted-foreground"
            }
          >
            {booking.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(booking.startTime).toLocaleDateString()} -{" "}
              {new Date(booking.endTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{booking.duration} hours</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">${booking.totalCost}</span>
          </div>
        </div>

        {booking.status === "active" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Extend
            </Button>
            <Button variant="destructive" size="sm" className="flex-1">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading bookings...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your parking bookings
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeBookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Bookings</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any active parking bookings at the moment
                  </p>
                  <Button asChild>
                    <a href="/parking">Book a Parking Spot</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            {completedBookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Booking History</h3>
                  <p className="text-muted-foreground">
                    Your completed bookings will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Bookings;
