
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MonthlyReport from "@/components/MonthlyReport";
import { Room } from "@/types";
import { isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// We'll use the same initial room data as in Dashboard
// In a real app, this would come from a backend service
const initialRooms: Room[] = [
  // Premium Rooms (1-10)
  ...Array.from({ length: 10 }, (_, i) => ({
    roomNumber: 101 + i,
    type: "Premium" as const,
    status: "Available" as const,
    guest: null
  })),
  
  // Deluxe Rooms (11-14)
  ...Array.from({ length: 4 }, (_, i) => ({
    roomNumber: 201 + i,
    type: "Deluxe" as const,
    status: "Available" as const,
    guest: null
  }))
];

// Add some demo data for reports
initialRooms[1].status = "Occupied";
initialRooms[1].guest = {
  billNumber: "MH230501001",
  name: "John Doe",
  phone: "9876543210",
  address: "123 Main St, City",
  checkInDate: new Date(),
  checkOutDate: new Date(new Date().setDate(new Date().getDate() + 3)),
  numberOfAdults: 2,
  numberOfChildren: 1,
  dailyRent: 3000,
  advancePaid: 1000,
  paymentMethod: "Cash",
  gstRate: 12,
  taxIncluded: true
};

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

// Add another booking from earlier this month
initialRooms[3].status = "Occupied";
initialRooms[3].guest = {
  billNumber: "MH230501003",
  name: "Alex Johnson",
  phone: "7654321098",
  address: "789 Lake View, Village",
  checkInDate: new Date(new Date().setDate(new Date().getDate() - 5)),
  checkOutDate: new Date(new Date().setDate(new Date().getDate() - 2)),
  numberOfAdults: 2,
  numberOfChildren: 2,
  dailyRent: 3000,
  advancePaid: 1500,
  paymentMethod: "UPI",
  gstRate: 12,
  taxIncluded: true
};

const Reports = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="container mx-auto">
          <MonthlyReport rooms={rooms} />
        </div>
      </main>
    </div>
  );
};

export default Reports;
