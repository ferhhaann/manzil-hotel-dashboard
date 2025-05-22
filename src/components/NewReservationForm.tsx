
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { addDays } from "date-fns";
import { Reservation, PaymentMethod } from "@/types";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import GuestInfoForm from "./reservation-form/GuestInfoForm";
import StayDetailsForm from "./reservation-form/StayDetailsForm";
import RoomSelectionForm from "./reservation-form/RoomSelectionForm";
import PaymentInfoForm from "./reservation-form/PaymentInfoForm";
import { availableRooms } from "./reservation-form/roomData";

interface NewReservationFormProps {
  onSubmit: (reservation: Reservation) => void;
}

const NewReservationForm: React.FC<NewReservationFormProps> = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomNumbers: [] as string[],
      checkInDate: new Date(),
      checkOutDate: addDays(new Date(), 1),
      adults: 1,
      children: 0,
      specialRequests: "",
      advanceAmount: 0,
      paymentMethod: "Cash" as PaymentMethod,
      source: "Direct" as "Direct" | "Website" | "OTA" | "Phone" | "Walk-in",
    },
  });
  
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Handle room selection
  const handleRoomToggle = (roomNumber: number, rate: number) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomNumber)) {
        return prev.filter(r => r !== roomNumber);
      } else {
        return [...prev, roomNumber];
      }
    });
    
    const checkInDate = form.getValues("checkInDate");
    const checkOutDate = form.getValues("checkOutDate");
    
    // Calculate nights
    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Recalculate total
    const newTotal = availableRooms
      .filter(room => {
        if (room.number === roomNumber) {
          return !selectedRooms.includes(roomNumber);
        }
        return selectedRooms.includes(room.number);
      })
      .reduce((sum, room) => sum + room.rate, 0) * nights;
    
    setTotalAmount(newTotal);
  };
  
  // Update total when dates change
  const handleDateChange = () => {
    const checkInDate = form.getValues("checkInDate");
    const checkOutDate = form.getValues("checkOutDate");
    
    // Calculate nights
    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate total
    const newTotal = availableRooms
      .filter(room => selectedRooms.includes(room.number))
      .reduce((sum, room) => sum + room.rate, 0) * nights;
    
    setTotalAmount(newTotal);
  };
  
  // Handle form submission
  const handleFormSubmit = form.handleSubmit((data) => {
    if (selectedRooms.length === 0) {
      form.setError("roomNumbers", {
        type: "manual",
        message: "Please select at least one room",
      });
      return;
    }
    
    const newReservation: Reservation = {
      id: `RES${Math.floor(Math.random() * 900) + 100}`,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      roomNumbers: selectedRooms,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: data.adults,
      children: data.children,
      specialRequests: data.specialRequests,
      status: "Confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
      totalAmount: totalAmount,
      advanceAmount: data.advanceAmount,
      paymentStatus: data.advanceAmount === 0 ? "Pending" : 
                   data.advanceAmount < totalAmount ? "Partially Paid" : "Paid",
      paymentMethod: data.paymentMethod,
      source: data.source
    };
    
    onSubmit(newReservation);
    document.body.click(); // Close the dialog
  });
  
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New Reservation</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <GuestInfoForm />
          <StayDetailsForm handleDateChange={handleDateChange} />
          <RoomSelectionForm 
            availableRooms={availableRooms}
            selectedRooms={selectedRooms}
            handleRoomToggle={handleRoomToggle}
          />
          <PaymentInfoForm totalAmount={totalAmount} />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => document.body.click()}>
              Cancel
            </Button>
            <Button type="submit" className="gold-gradient text-primary-foreground hover:opacity-90">
              Create Reservation
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default NewReservationForm;
