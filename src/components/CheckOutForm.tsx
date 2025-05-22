
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Room } from "@/types";
import { calculateBill } from "@/utils/calculateBill";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CheckOutFormProps {
  room: Room;
  onCheckOut: (roomNumber: number) => void;
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({ room, onCheckOut }) => {
  const { toast } = useToast();
  
  if (!room.guest) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <p>No guest information available for this room.</p>
        <DialogFooter>
          <Button onClick={() => document.body.click()}>Close</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  const summary = calculateBill(room.guest);
  const checkInDate = new Date(room.guest.checkInDate);
  const checkOutDate = new Date(room.guest.checkOutDate);

  const handleCheckOut = () => {
    onCheckOut(room.roomNumber);
    
    toast({
      title: "Check-out Successful",
      description: `Guest ${room.guest?.name} has checked out from Room ${room.roomNumber}`,
    });
    
    // Close dialog
    document.body.click();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl">
          Check Out - Room {room.roomNumber}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Guest Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bill Number:</span>
              <span>{room.guest.billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{room.guest.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span>{room.guest.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in:</span>
              <span>{format(checkInDate, "dd MMM yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out:</span>
              <span>{format(checkOutDate, "dd MMM yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stay Duration:</span>
              <span>{summary.duration} day(s)</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Billing Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Rent:</span>
              <span>₹ {room.guest.dailyRent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Amount:</span>
              <span>₹ {summary.baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CGST ({room.guest.gstRate / 2}%):</span>
              <span>₹ {summary.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SGST ({room.guest.gstRate / 2}%):</span>
              <span>₹ {summary.sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>₹ {summary.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advance Paid:</span>
              <span>₹ {room.guest.advancePaid}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Final Payment:</span>
              <span>₹ {summary.netPayable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span>{room.guest.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="flex justify-end gap-4 mt-4">
        <Button variant="outline" onClick={() => document.body.click()}>
          Cancel
        </Button>
        <Button 
          onClick={handleCheckOut}
          className="gold-gradient text-primary hover:opacity-90 transition-opacity"
        >
          Complete Check-out
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CheckOutForm;
