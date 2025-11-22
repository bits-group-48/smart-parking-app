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
