
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room, RoomStatus } from "@/types";
import { format } from "date-fns";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import CheckInForm from "./CheckInForm";
import CheckOutForm from "./CheckOutForm";
import { MoreHorizontal, Settings, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  const handleStatusChange = (newStatus: RoomStatus) => {
    if (status !== newStatus) {
      onStatusUpdate(roomNumber, newStatus);
      setIsStatusDialogOpen(false);
    }
  };

  return (
    <Card className={`w-full shadow-sm overflow-hidden flex flex-col h-full border-2 ${getCardClass(status)}`}>
      <CardHeader className="p-2 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Room {roomNumber}</CardTitle>
          <span className="text-xs font-medium bg-accent/20 px-2 py-0.5 rounded-full text-accent-foreground">
            {type}
          </span>
        </div>
        <div className="mt-1">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>{status}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 flex-grow text-xs">
        {status === "Occupied" && guest && (
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-primary">{guest.name}</p>
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">In:</span>
                <span>{format(new Date(guest.checkInDate), "dd MMM")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Out:</span>
                <span>{format(new Date(guest.checkOutDate), "dd MMM")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill:</span>
                <span>{guest.billNumber.substring(guest.billNumber.length - 4)}</span>
              </div>
            </div>
          </div>
        )}
        
        {status !== "Occupied" && (
          <div className="h-12 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              {status === "Available" ? "Ready for check-in" : 
               status === "Cleaning" ? "Room being cleaned" : 
               "Under maintenance"}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 pt-0 flex justify-between gap-1">
        <div className="flex gap-1">
          {/* View button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={() => setIsViewDetailsOpen(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Details</TooltipContent>
          </Tooltip>

          {/* Status change menu */}
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 w-7 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("Available")}
                    disabled={status === "Available"}
                    className="text-green-600"
                  >
                    Set as Available
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("Occupied")}
                    disabled={status === "Occupied"}
                    className="text-amber-600"
                  >
                    Set as Occupied
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("Maintenance")}
                    disabled={status === "Maintenance"}
                    className="text-gray-600"
                  >
                    Set as Maintenance
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("Cleaning")}
                    disabled={status === "Cleaning"}
                    className="text-blue-600"
                  >
                    Set as Cleaning
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>Change Status</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-grow flex justify-end">
          {status === "Available" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1 gold-gradient text-primary-foreground hover:opacity-90 transition-opacity text-xs h-7 px-2">
                  Check In
                </Button>
              </DialogTrigger>
              <CheckInForm room={room} onCheckIn={onCheckIn} />
            </Dialog>
          )}
          
          {status === "Occupied" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1 text-xs h-7 px-2" variant="outline">
                  Check Out
                </Button>
              </DialogTrigger>
              <CheckOutForm room={room} onCheckOut={onCheckOut} />
            </Dialog>
          )}
        </div>
      </CardFooter>

      {/* View Room Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Room {roomNumber} Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Room Number:</div>
              <div>{roomNumber}</div>
              
              <div className="text-sm font-medium">Type:</div>
              <div>{type}</div>
              
              <div className="text-sm font-medium">Status:</div>
              <div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
                  {status}
                </span>
              </div>
            </div>

            {status === "Occupied" && guest && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Guest Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Name:</div>
                  <div>{guest.name}</div>
                  
                  <div className="font-medium">Phone:</div>
                  <div>{guest.phone}</div>
                  
                  <div className="font-medium">Check-in Date:</div>
                  <div>{format(new Date(guest.checkInDate), "dd MMM yyyy")}</div>
                  
                  <div className="font-medium">Check-out Date:</div>
                  <div>{format(new Date(guest.checkOutDate), "dd MMM yyyy")}</div>
                  
                  <div className="font-medium">Bill Number:</div>
                  <div>{guest.billNumber}</div>
                  
                  <div className="font-medium">Adults/Children:</div>
                  <div>{guest.numberOfAdults}/{guest.numberOfChildren}</div>
                  
                  <div className="font-medium">Daily Rent:</div>
                  <div>₹{guest.dailyRent}</div>
                  
                  <div className="font-medium">Advance Paid:</div>
                  <div>₹{guest.advancePaid}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsViewDetailsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog - removed as we're now using dropdown menu */}
    </Card>
  );
};

export default RoomCard;
