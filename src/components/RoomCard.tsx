
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room, RoomStatus } from "@/types";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CheckInForm from "./CheckInForm";
import CheckOutForm from "./CheckOutForm";

interface RoomCardProps {
  room: Room;
  onStatusUpdate: (roomNumber: number, status: RoomStatus) => void;
  onCheckIn: (roomNumber: number, guest: any) => void;
  onCheckOut: (roomNumber: number) => void;
}

const getCardClass = (status: RoomStatus): string => {
  switch (status) {
    case "Available": return "bg-green-100 border-green-500";
    case "Occupied": return "bg-amber-100 border-amber-500";
    case "Maintenance": return "bg-gray-200 border-gray-500";
    case "Cleaning": return "bg-blue-100 border-blue-500";
    default: return "";
  }
};

const getStatusBadgeClass = (status: RoomStatus): string => {
  switch (status) {
    case "Available": return "bg-green-500 text-white";
    case "Occupied": return "bg-amber-500 text-white";
    case "Maintenance": return "bg-gray-500 text-white";
    case "Cleaning": return "bg-blue-500 text-white";
    default: return "status-badge";
  }
};

const RoomCard: React.FC<RoomCardProps> = ({ room, onStatusUpdate, onCheckIn, onCheckOut }) => {
  const { roomNumber, type, status, guest } = room;
  
  const handleStatusChange = (newStatus: RoomStatus) => {
    if (status !== newStatus) {
      onStatusUpdate(roomNumber, newStatus);
    }
  };

  return (
    <Card className={`w-full shadow-md overflow-hidden flex flex-col h-full border-2 ${getCardClass(status)}`}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Room {roomNumber}</CardTitle>
          <span className="text-sm font-medium bg-accent/20 px-3 py-1 rounded-full text-accent-foreground">
            {type}
          </span>
        </div>
        <div className="mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>{status}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow">
        {status === "Occupied" && guest && (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-primary">{guest.name}</p>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in:</span>
                <span>{format(new Date(guest.checkInDate), "dd MMM yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out:</span>
                <span>{format(new Date(guest.checkOutDate), "dd MMM yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill #:</span>
                <span>{guest.billNumber}</span>
              </div>
            </div>
          </div>
        )}
        
        {status !== "Occupied" && (
          <div className="h-20 flex items-center justify-center">
            <p className="text-muted-foreground">
              {status === "Available" ? "Ready for check-in" : 
               status === "Cleaning" ? "Room being cleaned" : 
               "Under maintenance"}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between flex-wrap gap-2">
        {status === "Available" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 gold-gradient text-primary-foreground hover:opacity-90 transition-opacity">
                Check In
              </Button>
            </DialogTrigger>
            <CheckInForm room={room} onCheckIn={onCheckIn} />
          </Dialog>
        )}
        
        {status === "Occupied" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1" variant="outline">
                Check Out
              </Button>
            </DialogTrigger>
            <CheckOutForm room={room} onCheckOut={onCheckOut} />
          </Dialog>
        )}
        
        {/* Status change dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex-1">
              Change Status
            </Button>
          </DialogTrigger>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Update Room Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleStatusChange("Available")}
                  disabled={status === "Available"}
                  variant="outline"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Available
                </Button>
                <Button
                  onClick={() => handleStatusChange("Occupied")}
                  disabled={status === "Occupied"}
                  variant="outline"
                  className="bg-amber-500 text-white hover:bg-amber-600"
                >
                  Occupied
                </Button>
                <Button
                  onClick={() => handleStatusChange("Maintenance")}
                  disabled={status === "Maintenance"}
                  variant="outline"
                  className="bg-gray-500 text-white hover:bg-gray-600"
                >
                  Maintenance
                </Button>
                <Button
                  onClick={() => handleStatusChange("Cleaning")}
                  disabled={status === "Cleaning"}
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Cleaning
                </Button>
              </div>
              <Button className="w-full mt-4" onClick={() => document.body.click()}>
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
