"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParkingSpotType } from "./parking";
import { Car, Thermometer, Droplets } from "lucide-react";

interface ParkingSpotProps {
  spot: ParkingSpotType;
  onBook?: (spot: ParkingSpotType) => void;
}

const ParkingSpot = ({ spot, onBook }: ParkingSpotProps) => {
  const statusColors = {
    available: "bg-success text-success-foreground",
    occupied: "bg-destructive text-destructive-foreground",
    reserved: "bg-warning text-warning-foreground",
  };

  const statusLabels = {
    available: "Available",
    occupied: "Occupied",
    reserved: "Reserved",
  };

  return (
    <Card className={`shadow-card hover:shadow-elevated transition-all ${
      spot.status === "available" ? "border-success/50 hover:border-success" : ""
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" />
            <span className="font-bold text-lg">{spot.slotNumber}</span>
          </div>
          <Badge className={statusColors[spot.status]}>
            {statusLabels[spot.status]}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Floor</span>
            <span className="font-medium">{spot.floor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Section</span>
            <span className="font-medium">{spot.section}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span className="font-medium">${spot.rate}/hr</span>
          </div>
        </div>

        {/* IoT Sensor Data */}
        <div className="mt-3 pt-3 border-t border-border space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Thermometer className="h-3 w-3" />
            <span>{spot.sensor.temperature.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Droplets className="h-3 w-3" />
            <span>{spot.sensor.humidity.toFixed(1)}%</span>
          </div>
        </div>

        {spot.status === "available" && onBook && (
          <Button 
            onClick={() => onBook(spot)} 
            className="w-full mt-4"
            size="sm"
          >
            Book Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ParkingSpot;
