"use client"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ParkingSquare, TrendingUp, Activity, Plus } from "lucide-react";


const Admin = () => {
  const [users] = useState(mockUsers);
  const [parkingSpots, setParkingSpots] = useState(mockParkingSpots);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  
  const [newSpot, setNewSpot] = useState({
    slotNumber: "",
    floor: "1",
    section: "A",
    status: "available" as const,
    rate: ""
  });

  const handleAddSpot = () => {
    if (!newSpot.slotNumber || !newSpot.rate) {
    }

    const spot: ParkingSpot = {
      id: `P${parkingSpots.length + 1}`,
      slotNumber: newSpot.slotNumber,
      floor: parseInt(newSpot.floor),
      section: newSpot.section,
      status: newSpot.status,
      rate: parseInt(newSpot.rate),
      sensor: {
        temperature: 25,
        humidity: 45,
        lastUpdate: new Date().toISOString()
      }
    };

    setParkingSpots([...parkingSpots, spot]);
    setIsAddDialogOpen(false);
    setNewSpot({
      slotNumber: "",
      floor: "1",
      section: "A",
      status: "available",
      rate: ""
    });
    
  };

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalBookings = users.reduce((sum, u) => sum + u.totalBookings, 0);
  const availableSpots = parkingSpots.filter(s => s.status === "available").length;
  const occupiedSpots = parkingSpots.filter(s => s.status === "occupied").length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and parking spots</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeUsers} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-success/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
              <ParkingSquare className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableSpots}</div>
              <p className="text-xs text-muted-foreground">
                {occupiedSpots} occupied
              </p>
            </CardContent>
          </Card>

          <Card className="border-warning/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((occupiedSpots / parkingSpots.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="parking">Parking Spots</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Complete list of registered users and their activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-center">Bookings</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{new Date(user.registeredDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">{user.totalBookings}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "default" : "secondary"}
                            className={user.status === "active" ? "bg-success" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parking" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Parking Spot Management</CardTitle>
                    <CardDescription>
                      Overview of all parking spots and their current status
                    </CardDescription>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Spot
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Parking Spot</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new parking spot
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="slotNumber">Slot Number</Label>
                          <Input
                            id="slotNumber"
                            placeholder="e.g., A101"
                            value={newSpot.slotNumber}
                            onChange={(e) => setNewSpot({ ...newSpot, slotNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="floor">Floor</Label>
                          <Select
                            value={newSpot.floor}
                            onValueChange={(value) => setNewSpot({ ...newSpot, floor: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Floor 1</SelectItem>
                              <SelectItem value="2">Floor 2</SelectItem>
                              <SelectItem value="3">Floor 3</SelectItem>
                              <SelectItem value="4">Floor 4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="section">Section</Label>
                          <Select
                            value={newSpot.section}
                            onValueChange={(value) => setNewSpot({ ...newSpot, section: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Section A</SelectItem>
                              <SelectItem value="B">Section B</SelectItem>
                              <SelectItem value="C">Section C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={newSpot.status}
                            onValueChange={(value) => setNewSpot({ ...newSpot, status: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rate">Rate per Hour (₹)</Label>
                          <Input
                            id="rate"
                            type="number"
                            placeholder="e.g., 50"
                            value={newSpot.rate}
                            onChange={(e) => setNewSpot({ ...newSpot, rate: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleAddSpot} className="w-full">
                          Add Parking Spot
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Spot Number</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Sensor Status</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Rate/Hour</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parkingSpots.map((spot) => (
                      <TableRow key={spot.id}>
                        <TableCell className="font-medium">{spot.slotNumber}</TableCell>
                        <TableCell>Floor {spot.floor}</TableCell>
                        <TableCell>Section {spot.section}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-success text-success">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              spot.status === "available"
                                ? "default"
                                : spot.status === "occupied"
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              spot.status === "available"
                                ? "bg-success"
                                : spot.status === "occupied"
                                ? "bg-warning"
                                : ""
                            }
                          >
                            {spot.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{spot.rate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

    </div>
  );
};

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    registeredDate: string;
    totalBookings: number;
    status: "active" | "inactive";
  }
  
  export const mockUsers: User[] = [
    {
      id: "1",
      name: "Prijith ",
      email: "prijith@gmail.com",
      phone: "+91 98765 43210",
      registeredDate: "2024-01-15",
      totalBookings: 24,
      status: "active",
    },
    {
      id: "2",
      name: "Navya",
      email: "navya@gmail.com",
      phone: "+91 98765 43211",
      registeredDate: "2024-02-20",
      totalBookings: 18,
      status: "active",
    },
    {
      id: "3",
      name: "Naveen",
      email: "naveen.@gmail.com",
      phone: "+91 98765 43212",
      registeredDate: "2024-03-10",
      totalBookings: 32,
      status: "active",
    },
    {
      id: "4",
      name: "Jasper",
      email: "Jasper@gmail.com",
      phone: "+91 98765 43213",
      registeredDate: "2024-01-25",
      totalBookings: 15,
      status: "inactive",
    },
    {
      id: "5",
      name: "Jahnavi",
      email: "Jahnavi@gmail.com",
      phone: "+91 98765 43214",
      registeredDate: "2024-02-05",
      totalBookings: 28,
      status: "active",
    },

  ];



  export interface ParkingSpot {
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

  export type ParkingStatus = "available" | "occupied" | "reserved";

export interface ParkingSpot {
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
export const mockParkingSpots: ParkingSpot[] = [
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

export default Admin;