
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room, RoomStatus, Guest, PaymentMethod } from "@/types";
import { format } from "date-fns";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { calculateBill } from "@/utils/calculateBill";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editableGuest, setEditableGuest] = useState<Partial<Guest> | null>(null);
  const [billSummary, setBillSummary] = useState<any>(null);
  
  const handleStatusChange = (newStatus: RoomStatus) => {
    if (status !== newStatus) {
      onStatusUpdate(roomNumber, newStatus);
      setIsStatusDialogOpen(false);
    }
  };

  const startEditing = () => {
    if (guest) {
      // Create a deep copy of the guest object to avoid direct mutation
      setEditableGuest({
        ...guest,
        checkInDate: new Date(guest.checkInDate),
        checkOutDate: new Date(guest.checkOutDate)
      });
      setIsEditing(true);
      
      // Calculate initial bill summary
      if (
        guest.checkInDate && 
        guest.checkOutDate && 
        guest.dailyRent !== undefined && 
        guest.gstRate !== undefined &&
        guest.taxIncluded !== undefined &&
        guest.advancePaid !== undefined
      ) {
        setBillSummary(calculateBill(guest));
      }
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditableGuest(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (editableGuest) {
      if (type === 'number') {
        setEditableGuest((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
      } else {
        setEditableGuest((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editableGuest) {
      setEditableGuest((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (editableGuest) {
      setEditableGuest((prev) => {
        // Special handling for taxIncluded which is a boolean
        if (name === "taxIncluded") {
          return { ...prev, [name]: value === "including" };
        }
        return { ...prev, [name]: value };
      });
    }
  };

  const handleSaveChanges = () => {
    if (editableGuest && status === "Occupied") {
      // Make sure we have proper date objects
      const updatedGuest = {
        ...editableGuest,
        checkInDate: new Date(editableGuest.checkInDate as string | Date),
        checkOutDate: new Date(editableGuest.checkOutDate as string | Date),
        // Make sure all required fields are present and with correct types
        dailyRent: Number(editableGuest.dailyRent),
        gstRate: Number(editableGuest.gstRate),
        taxIncluded: Boolean(editableGuest.taxIncluded),
        advancePaid: Number(editableGuest.advancePaid),
        numberOfAdults: Number(editableGuest.numberOfAdults),
        numberOfChildren: Number(editableGuest.numberOfChildren)
      } as Guest;
      
      console.log("Saving updated guest:", updatedGuest);
      
      // Use onCheckIn to update the guest details
      onCheckIn(roomNumber, updatedGuest);
      setIsEditing(false);
      setEditableGuest(null);
      setIsViewDetailsOpen(false);
    }
  };

  // Update bill summary when editable guest changes
  React.useEffect(() => {
    if (
      editableGuest?.checkInDate && 
      editableGuest?.checkOutDate && 
      editableGuest?.dailyRent !== undefined && 
      editableGuest?.gstRate !== undefined &&
      editableGuest?.taxIncluded !== undefined &&
      editableGuest?.advancePaid !== undefined
    ) {
      // Create a temporary guest object with the correct types for calculation
      const tempGuest = {
        ...editableGuest,
        checkInDate: new Date(editableGuest.checkInDate),
        checkOutDate: new Date(editableGuest.checkOutDate),
        dailyRent: Number(editableGuest.dailyRent),
        gstRate: Number(editableGuest.gstRate),
        taxIncluded: Boolean(editableGuest.taxIncluded),
        advancePaid: Number(editableGuest.advancePaid)
      } as Guest;
      
      setBillSummary(calculateBill(tempGuest));
    }
  }, [editableGuest]);

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

      {/* View Room Details Dialog - Now with Edit Functionality */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Room {roomNumber} Details</DialogTitle>
            <DialogDescription>View and edit room information</DialogDescription>
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

            {status === "Occupied" && guest && !isEditing && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Guest Information</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={startEditing}
                    className="text-xs"
                  >
                    Edit Details
                  </Button>
                </div>
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

            {/* Edit Mode Form */}
            {status === "Occupied" && editableGuest && isEditing && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Edit Guest Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Guest Name</Label>
                    <Input
                      id="editName"
                      name="name"
                      value={editableGuest.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone Number</Label>
                    <Input
                      id="editPhone"
                      name="phone"
                      value={editableGuest.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editBillNumber">Bill Number</Label>
                    <Input
                      id="editBillNumber"
                      name="billNumber"
                      value={editableGuest.billNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editPaymentMethod">Payment Method</Label>
                    <Select 
                      name="paymentMethod" 
                      onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      defaultValue={editableGuest.paymentMethod as string}
                    >
                      <SelectTrigger id="editPaymentMethod">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editAddress">Address</Label>
                    <Input
                      id="editAddress"
                      name="address"
                      value={editableGuest.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editCheckInDate">Check-in Date</Label>
                        <Input
                          id="editCheckInDate"
                          name="checkInDate"
                          type="date"
                          value={editableGuest.checkInDate instanceof Date 
                            ? editableGuest.checkInDate.toISOString().split('T')[0] 
                            : new Date(editableGuest.checkInDate as Date).toISOString().split('T')[0]}
                          onChange={handleDateChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="editCheckOutDate">Check-out Date</Label>
                        <Input
                          id="editCheckOutDate"
                          name="checkOutDate"
                          type="date"
                          value={editableGuest.checkOutDate instanceof Date 
                            ? editableGuest.checkOutDate.toISOString().split('T')[0] 
                            : new Date(editableGuest.checkOutDate as Date).toISOString().split('T')[0]}
                          onChange={handleDateChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editAdults">Number of Adults</Label>
                    <Input
                      id="editAdults"
                      name="numberOfAdults"
                      type="number"
                      min="1"
                      value={editableGuest.numberOfAdults}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editChildren">Number of Children</Label>
                    <Input
                      id="editChildren"
                      name="numberOfChildren"
                      type="number"
                      min="0"
                      value={editableGuest.numberOfChildren}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editDailyRent">Daily Rent (₹)</Label>
                    <Input
                      id="editDailyRent"
                      name="dailyRent"
                      type="number"
                      min="0"
                      value={editableGuest.dailyRent}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editAdvancePaid">Advance Paid (₹)</Label>
                    <Input
                      id="editAdvancePaid"
                      name="advancePaid"
                      type="number"
                      min="0"
                      value={editableGuest.advancePaid}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>GST Type</Label>
                    <RadioGroup 
                      defaultValue={editableGuest.taxIncluded ? "including" : "excluding"}
                      onValueChange={(value) => handleSelectChange("taxIncluded", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="including" id="editIncluding" />
                        <Label htmlFor="editIncluding">Including</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excluding" id="editExcluding" />
                        <Label htmlFor="editExcluding">Excluding</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editGstRate">GST Rate (%)</Label>
                    <Input
                      id="editGstRate"
                      name="gstRate"
                      type="number"
                      min="0"
                      max="100"
                      value={editableGuest.gstRate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {/* Bill Summary */}
                {billSummary && (
                  <div className="mt-4 p-4 bg-muted/30 border border-dashed rounded-lg">
                    <h4 className="font-medium mb-2">Updated Bill Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Stay Duration:</span>
                        <span>{billSummary.duration} day(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Amount:</span>
                        <span>₹ {billSummary.baseAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CGST ({(editableGuest.gstRate as number) / 2}%):</span>
                        <span>₹ {billSummary.cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST ({(editableGuest.gstRate as number) / 2}%):</span>
                        <span>₹ {billSummary.sgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Amount:</span>
                        <span>₹ {billSummary.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance Paid:</span>
                        <span>₹ {billSummary.advancePaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Net Payable:</span>
                        <span>₹ {billSummary.netPayable.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsViewDetailsOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoomCard;
