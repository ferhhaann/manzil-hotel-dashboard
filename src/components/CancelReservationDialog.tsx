
import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/types";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";

interface CancelReservationDialogProps {
  reservation: Reservation;
  onCancel: () => void;
  onClose: () => void;
}

const CancelReservationDialog: React.FC<CancelReservationDialogProps> = ({ 
  reservation, 
  onCancel,
  onClose 
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <span>Cancel Reservation</span>
        </DialogTitle>
      </DialogHeader>
      
      <div className="py-4">
        <p className="mb-4">
          Are you sure you want to cancel the following reservation?
        </p>
        
        <div className="bg-muted/50 p-4 rounded-md space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Reservation ID:</span>
            <span>{reservation.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Guest:</span>
            <span>{reservation.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Check-in:</span>
            <span>{format(new Date(reservation.checkInDate), "dd MMM yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Check-out:</span>
            <span>{format(new Date(reservation.checkOutDate), "dd MMM yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Room(s):</span>
            <span>{reservation.roomNumbers.join(", ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Amount:</span>
            <span>₹ {reservation.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Advance Paid:</span>
            <span>₹ {reservation.advanceAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-4 text-destructive text-sm">
          <p><strong>Note:</strong> This action cannot be undone. Cancelling the reservation may require refund processing according to your cancellation policy.</p>
        </div>
      </div>
      
      <DialogFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Keep Reservation
        </Button>
        <Button 
          variant="destructive"
          onClick={onCancel}
        >
          Cancel Reservation
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CancelReservationDialog;
