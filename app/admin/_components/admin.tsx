"use client"
import { useState, useEffect } from "react";
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
import { toast } from "sonner";

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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  totalBookings: number;
  status: "active" | "inactive";
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const [newSpot, setNewSpot] = useState({
    slotNumber: "",
    floor: "1",
    section: "A",
    status: "available" as const,
    rate: ""
  });

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

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const response = await fetch("/api/users");
        const data = await response.json();
        
        if (response.ok && data.success) {
          setUsers(data.data);
        } else {
          toast.error(data.error || "Failed to load users");
        }
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddSpot = async () => {
    if (!newSpot.slotNumber || !newSpot.rate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/parking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotNumber: newSpot.slotNumber,
          floor: parseInt(newSpot.floor),
          section: newSpot.section,
          status: newSpot.status,
          rate: parseFloat(newSpot.rate),
          temperature: 25,
          humidity: 45,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Parking spot added successfully");
        // Refresh the parking spots list
        const refreshResponse = await fetch("/api/parking");
        const refreshData = await refreshResponse.json();
        if (refreshResponse.ok && refreshData.success) {
          setParkingSpots(refreshData.data);
        }
        setIsAddDialogOpen(false);
        setNewSpot({
          slotNumber: "",
          floor: "1",
          section: "A",
          status: "available",
          rate: ""
        });
      } else {
        toast.error(data.error || "Failed to add parking spot");
      }
    } catch (error: any) {
      console.error("Error adding parking spot:", error);
      toast.error("Failed to add parking spot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalBookings = users.reduce((sum, u) => sum + u.totalBookings, 0);
  const availableSpots = parkingSpots.filter(s => s.status === "available").length;
  const occupiedSpots = parkingSpots.filter(s => s.status === "occupied").length;
  const reservedSpots = parkingSpots.filter(s => s.status === "reserved").length;

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
                {parkingSpots.length > 0 
                  ? Math.round(((occupiedSpots + reservedSpots) / parkingSpots.length) * 100)
                  : 0}%
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
                {isLoadingUsers ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : (
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
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
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
                        <Button 
                          onClick={handleAddSpot} 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Adding..." : "Add Parking Spot"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading parking spots...</p>
                  </div>
                ) : (
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
                      {parkingSpots.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No parking spots found. Add your first parking spot!
                          </TableCell>
                        </TableRow>
                      ) : (
                        parkingSpots.map((spot) => (
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

    </div>
  );
};





export default Admin;