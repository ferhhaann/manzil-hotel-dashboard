
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import ReservationCalendar from "@/components/ReservationCalendar";
import ReservationsList from "@/components/ReservationsList";
import NewReservationForm from "@/components/NewReservationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Reservation } from "@/types";

// Sample reservation data
const sampleReservations: Reservation[] = [
  {
    id: "RES001",
    guestName: "John Smith",
    guestEmail: "john@example.com",
    guestPhone: "9876543210",
    roomNumbers: [101, 102],
    checkInDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    adults: 2,
    children: 1,
    status: "Confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
    totalAmount: 12000,
    advanceAmount: 3000,
    paymentStatus: "Partially Paid",
    paymentMethod: "Card",
    source: "Website",
    specialRequests: "Early check-in requested"
  },
  {
    id: "RES002",
    guestName: "Mary Johnson",
    guestEmail: "mary@example.com",
    guestPhone: "8765432109",
    roomNumbers: [201],
    checkInDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 4)),
    adults: 1,
    children: 0,
    status: "Confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
    totalAmount: 9000,
    advanceAmount: 0,
    paymentStatus: "Pending",
    paymentMethod: "Cash",
    source: "Direct"
  },
  {
    id: "RES003",
    guestName: "David Williams",
    guestEmail: "david@example.com",
    guestPhone: "7654321098",
    roomNumbers: [301, 302, 303],
    checkInDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 12)),
    adults: 5,
    children: 2,
    status: "Confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
    totalAmount: 35000,
    advanceAmount: 10000,
    paymentStatus: "Partially Paid",
    paymentMethod: "Card",
    source: "OTA",
    specialRequests: "Connected rooms required"
  }
];

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  // Handle adding new reservation
  const handleAddReservation = (reservation: Reservation) => {
    setReservations(prev => [reservation, ...prev]);
    toast({
      title: "Reservation Created",
      description: `Reservation #${reservation.id} for ${reservation.guestName} has been created.`,
    });
  };

  // Handle updating reservation
  const handleUpdateReservation = (updatedReservation: Reservation) => {
    setReservations(prev => 
      prev.map(r => r.id === updatedReservation.id ? updatedReservation : r)
    );
    toast({
      title: "Reservation Updated",
      description: `Reservation #${updatedReservation.id} has been updated.`,
    });
  };

  // Handle cancellation
  const handleCancelReservation = (reservationId: string) => {
    setReservations(prev => 
      prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: "Cancelled" as const, updatedAt: new Date() } 
          : r
      )
    );
    toast({
      title: "Reservation Cancelled",
      description: `Reservation #${reservationId} has been cancelled.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow p-2 md:p-3">
        <div className="container mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-2xl font-bold">Reservations</h1>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gold-gradient text-primary-foreground hover:opacity-90">
                  New Reservation
                </Button>
              </DialogTrigger>
              <NewReservationForm onSubmit={handleAddReservation} />
            </Dialog>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="mt-4">
              <ReservationsList 
                reservations={reservations} 
                onCancel={handleCancelReservation}
                onUpdate={handleUpdateReservation}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-4">
              <ReservationCalendar reservations={reservations} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reservations;
