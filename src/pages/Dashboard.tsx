
import React, { useState, useEffect } from "react";
import RoomCard from "@/components/RoomCard";
import Navbar from "@/components/Navbar";
import { Room, RoomStatus, Guest } from "@/types";
import { getCurrentUser, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

// Initial rooms data
const initialRooms: Room[] = [
  // Premium Rooms (1-10)
  ...Array.from({ length: 10 }, (_, i) => ({
    roomNumber: 101 + i,
    type: "Premium" as const,
    status: "Available" as RoomStatus,
    guest: null
  })),
  
  // Deluxe Rooms (11-14)
  ...Array.from({ length: 4 }, (_, i) => ({
    roomNumber: 201 + i,
    type: "Deluxe" as const,
    status: "Available" as RoomStatus,
    guest: null
  }))
];

// Set some rooms to different statuses for demo purposes
initialRooms[1].status = "Occupied";
initialRooms[1].guest = {
  billNumber: "MH230501001",
  name: "John Doe",
  phone: "9876543210",
  address: "123 Main St, City",
  checkInDate: new Date(new Date().setDate(new Date().getDate() - 2)),
  checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  numberOfAdults: 2,
  numberOfChildren: 1,
  dailyRent: 3000,
  advancePaid: 1000,
  paymentMethod: "Cash",
  gstRate: 12,
  taxIncluded: true
};

initialRooms[3].status = "Maintenance";
initialRooms[5].status = "Cleaning";
initialRooms[10].status = "Occupied";
initialRooms[10].guest = {
  billNumber: "MH230501002",
  name: "Jane Smith",
  phone: "8765432109",
  address: "456 Park Ave, Town",
  checkInDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  checkOutDate: new Date(new Date().setDate(new Date().getDate() + 3)),
  numberOfAdults: 1,
  numberOfChildren: 0,
  dailyRent: 2000,
  advancePaid: 500,
  paymentMethod: "Card",
  gstRate: 12,
  taxIncluded: false
};

const Dashboard = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);
  
  // Handle room status update
  const handleStatusUpdate = (roomNumber: number, newStatus: RoomStatus) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.roomNumber === roomNumber 
          ? { 
              ...room, 
              status: newStatus,
              // If changing to non-occupied status, remove guest info
              guest: newStatus !== "Occupied" ? null : room.guest
            } 
          : room
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Room ${roomNumber} status changed to ${newStatus}`,
    });
  };
  
  // Handle guest check-in
  const handleCheckIn = (roomNumber: number, guest: Guest) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.roomNumber === roomNumber 
          ? { ...room, status: "Occupied", guest } 
          : room
      )
    );
    
    toast({
      title: "Check-in Successful",
      description: `${guest.name} checked into Room ${roomNumber}`,
    });
  };
  
  // Handle guest check-out
  const handleCheckOut = (roomNumber: number) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.roomNumber === roomNumber 
          ? { ...room, status: "Cleaning", guest: null } 
          : room
      )
    );
    
    toast({
      title: "Check-out Complete",
      description: `Room ${roomNumber} has been checked out and marked for cleaning`,
    });
  };
  
  // Filter rooms based on selection
  const filteredRooms = filter === "all" 
    ? rooms 
    : rooms.filter(room => room.status === filter);
  
  // Count rooms by status
  const statusCounts = {
    all: rooms.length,
    Available: rooms.filter(room => room.status === "Available").length,
    Occupied: rooms.filter(room => room.status === "Occupied").length,
    Maintenance: rooms.filter(room => room.status === "Maintenance").length,
    Cleaning: rooms.filter(room => room.status === "Cleaning").length,
  };
  
  const user = getCurrentUser();
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Room Dashboard</h1>
            
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === "all" 
                    ? "bg-primary text-white" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                onClick={() => setFilter("all")}
              >
                All ({statusCounts.all})
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === "Available" 
                    ? "bg-green-500 text-white" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                onClick={() => setFilter("Available")}
              >
                Available ({statusCounts.Available})
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === "Occupied" 
                    ? "bg-amber-500 text-white" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                onClick={() => setFilter("Occupied")}
              >
                Occupied ({statusCounts.Occupied})
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === "Maintenance" 
                    ? "bg-gray-500 text-white" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                onClick={() => setFilter("Maintenance")}
              >
                Maintenance ({statusCounts.Maintenance})
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === "Cleaning" 
                    ? "bg-blue-500 text-white" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                onClick={() => setFilter("Cleaning")}
              >
                Cleaning ({statusCounts.Cleaning})
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map(room => (
              <RoomCard
                key={room.roomNumber}
                room={room}
                onStatusUpdate={handleStatusUpdate}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
            ))}
            
            {filteredRooms.length === 0 && (
              <Card className="col-span-full p-8 text-center">
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground">
                    No rooms match the selected filter.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
