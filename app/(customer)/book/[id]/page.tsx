"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ParkingSpot {
  id: string;
  slotNumber: string;
  status: string;
  floor: number;
  section: string;
  rate: number;
}

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const spotId = params.id as string;

  const [parkingSpot, setParkingSpot] = useState<ParkingSpot | null>(null);
  const [userVehicleNum, setUserVehicleNum] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    startTime: "",
    endTime: "",
  });

  // Check authentication
  useEffect(() => {
    if (sessionStatus === "loading") return;
    
    if (!session?.user) {
      router.push(`/auth?callbackUrl=${encodeURIComponent(`/book/${spotId}`)}`);
      toast.error("Please login to book a parking spot");
    }
  }, [session, sessionStatus, router, spotId]);

  // Fetch parking spot and user data
  useEffect(() => {
    const fetchData = async () => {
      if (sessionStatus === "loading" || !session?.user) return;

      try {
        setIsLoading(true);

        // Fetch parking spot
        const spotResponse = await fetch(`/api/parking`);
        const spotData = await spotResponse.json();
        
        if (spotData.success) {
          const spot = spotData.data.find((s: ParkingSpot) => s.id === spotId);
          if (spot) {
            setParkingSpot(spot);
          } else {
            toast.error("Parking spot not found");
            router.push("/parking");
          }
        }

        // Fetch user vehicle number
        const userResponse = await fetch(`/api/users/me`);
        const userData = await userResponse.json();
        
        if (userData.success) {
          setUserVehicleNum(userData.data.vehicleNum);
          setFormData(prev => ({
            ...prev,
            vehicleNumber: userData.data.vehicleNum,
          }));
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load booking information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [spotId, session, sessionStatus, router]);

  const handleEndTimeChange = (endTime: string) => {
    setFormData({
      ...formData,
      endTime,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parkingSpot || !session?.user) {
      toast.error("Please login to book a parking spot");
      return;
    }

    if (!formData.vehicleNumber || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    // Allow a small buffer (1 minute) to account for time differences
    const now = new Date();
    now.setSeconds(0, 0); // Reset seconds and milliseconds for comparison
    
    if (start >= end) {
      toast.error("End time must be after start time");
      return;
    }

    // Check if start time is in the past (with 1 minute buffer)
    if (start.getTime() < now.getTime() - 60000) {
      toast.error("Start time cannot be in the past");
      return;
    }

    // Calculate duration in hours
    const durationMs = end.getTime() - start.getTime();
    const duration = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places

    if (duration <= 0) {
      toast.error("Duration must be greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotId: spotId,
          vehicleNumber: formData.vehicleNumber,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          duration: duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create booking");
        return;
      }

      toast.success("Booking created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // Will redirect in useEffect
  }

  if (!parkingSpot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Parking spot not found</p>
          <Button onClick={() => router.push("/parking")} className="mt-4">
            Back to Parking
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Book Parking Spot</h1>

          {/* Parking Spot Info */}
          <Card className="mb-6 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                {parkingSpot.slotNumber}
              </CardTitle>
              <CardDescription>
                Floor {parkingSpot.floor}, Section {parkingSpot.section}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium">₹{parkingSpot.rate} per hour</span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Fill in the details to complete your booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="ABC-1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Date & Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Date & Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    min={formData.startTime || undefined}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/parking")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

