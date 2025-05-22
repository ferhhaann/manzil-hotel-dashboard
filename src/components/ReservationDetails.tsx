
import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, Users, BedDouble, CreditCard, MapPin, Phone, Mail } from "lucide-react";
import { Reservation } from "@/types";

interface ReservationDetailsProps {
  reservation: Reservation;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservation }) => {
  const checkInDate = new Date(reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOutDate);
  
  // Calculate number of nights
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center justify-between">
          <span>Reservation #{reservation.id}</span>
          <Badge 
            className={
              reservation.status === "Confirmed" ? "bg-green-500" : 
              reservation.status === "Cancelled" ? "bg-red-500" : 
              reservation.status === "Checked-in" ? "bg-blue-500" : 
              "bg-amber-500"
            }
          >
            {reservation.status}
          </Badge>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Guest Details */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Guest Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{reservation.guestName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{reservation.guestPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{reservation.guestEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Reservation Source: {reservation.source}</span>
            </div>
          </div>
        </div>
        
        {/* Stay Information */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Stay Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm">Check-in Date</div>
                <div className="font-medium">{format(checkInDate, "EEE, dd MMM yyyy")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm">Check-out Date</div>
                <div className="font-medium">{format(checkOutDate, "EEE, dd MMM yyyy")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm">Guests</div>
                <div className="font-medium">
                  {reservation.adults} Adult{reservation.adults !== 1 ? "s" : ""}, 
                  {reservation.children} Child{reservation.children !== 1 ? "ren" : ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm">Room(s)</div>
                <div className="font-medium">{reservation.roomNumbers.join(", ")}</div>
              </div>
            </div>
          </div>
          
          {reservation.specialRequests && (
            <div className="mt-2 border-t pt-2">
              <div className="text-sm">Special Requests:</div>
              <div className="italic text-muted-foreground">{reservation.specialRequests}</div>
            </div>
          )}
        </div>
        
        {/* Payment Information */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <Badge className={
                reservation.paymentStatus === "Paid" ? "bg-green-500" : 
                reservation.paymentStatus === "Partially Paid" ? "bg-amber-500" : 
                "bg-red-500"
              }>
                {reservation.paymentStatus}
              </Badge>
            </div>
            <div>Stay Duration:</div>
            <div className="font-medium">{nights} night{nights !== 1 ? "s" : ""}</div>
            
            <div>Total Amount:</div>
            <div className="font-medium">₹ {reservation.totalAmount.toFixed(2)}</div>
            
            <div>Advance Paid:</div>
            <div className="font-medium">₹ {reservation.advanceAmount.toFixed(2)}</div>
            
            <div>Balance Due:</div>
            <div className="font-medium">₹ {(reservation.totalAmount - reservation.advanceAmount).toFixed(2)}</div>
            
            <div>Payment Method:</div>
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>{reservation.paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <div>Created: {format(new Date(reservation.createdAt), "dd MMM yyyy, HH:mm")}</div>
          <div>Last Updated: {format(new Date(reservation.updatedAt), "dd MMM yyyy, HH:mm")}</div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => document.body.click()}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ReservationDetails;
