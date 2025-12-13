"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ParkingSpot from "./parking-spots";
import { Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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

const Parking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [parkingSpots, setParkingSpots] = useState<ParkingSpotType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  // Fetch parking spots from API
  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/parking");
        const data = await response.json();
        
        if (response.ok && data.success) {
          setParkingSpots(data.data);
        } else {
          toast.error(data.error || "Failed to load parking spots");
        }
      } catch (error: any) {
        console.error("Error fetching parking spots:", error);
        toast.error("Failed to load parking spots");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkingSpots();
  }, []);

  const filteredSpots = parkingSpots.filter((spot) => {
    const matchesSearch = spot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFloor = floorFilter === "all" || spot.floor.toString() === floorFilter;
    const matchesStatus = statusFilter === "all" || spot.status === statusFilter;
    return matchesSearch && matchesFloor && matchesStatus;
  });

  const handleBookSpot = (spot: ParkingSpotType) => {
    // Check if user is authenticated
    if (sessionStatus === "loading") {
      return; // Wait for session to load
    }

    if (!session?.user) {
      // Redirect to login with callback URL
      const currentUrl = window.location.pathname;
      navigate.push(`/auth?callbackUrl=${encodeURIComponent(currentUrl)}`);
      toast.error("Please login to book a parking spot");
      return;
    }

    // User is authenticated, proceed to booking page
    navigate.push(`/book/${spot.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h4 className="text-3xl font-bold mb-2">Available Parking Spots</h4>
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
              {Array.from(new Set(parkingSpots.map(spot => spot.floor)))
                .sort()
                .map(floor => (
                  <SelectItem key={floor} value={floor.toString()}>
                    Floor {floor}
                  </SelectItem>
                ))}
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
            {isLoading ? (
              "Loading parking spots..."
            ) : (
              `Showing ${filteredSpots.length} of ${parkingSpots.length} parking spots`
            )}
          </p>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading parking spots...</p>
          </div>
        )}

        {/* Parking Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSpots.map((spot) => (
              <ParkingSpot 
                key={spot.id} 
                spot={spot} 
                onBook={handleBookSpot}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredSpots.length === 0 && (
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


export default Parking;
