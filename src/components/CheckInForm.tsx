
import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Room, Guest, PaymentMethod } from "@/types";
import { generateBillNumber, calculateBill } from "@/utils/calculateBill";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface CheckInFormProps {
  room: Room;
  onCheckIn: (roomNumber: number, guest: Guest) => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ room, onCheckIn }) => {
  const [billNumber, setBillNumber] = useState(generateBillNumber());
  const [guest, setGuest] = useState<Partial<Guest>>({
    billNumber: billNumber,
    name: "",
    phone: "",
    address: "",
    checkInDate: new Date(),
    checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    numberOfAdults: 1,
    numberOfChildren: 0,
    dailyRent: room.type === "Premium" ? 3000 : 2000, // Default rent based on room type
    advancePaid: 0,
    paymentMethod: "Cash",
    gstRate: 12,
    taxIncluded: true
  });
  const [summary, setSummary] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (
      guest.checkInDate && 
      guest.checkOutDate && 
      guest.dailyRent !== undefined && 
      guest.gstRate !== undefined &&
      guest.taxIncluded !== undefined &&
      guest.advancePaid !== undefined
    ) {
      const guestWithDates = {
        ...guest,
        checkInDate: new Date(guest.checkInDate),
        checkOutDate: new Date(guest.checkOutDate),
        dailyRent: Number(guest.dailyRent),
        gstRate: Number(guest.gstRate),
        taxIncluded: Boolean(guest.taxIncluded),
        advancePaid: Number(guest.advancePaid)
      } as Guest;
      
      setSummary(calculateBill(guestWithDates));
    }
  }, [guest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setGuest((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
    } else {
      setGuest((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!guest.name || !guest.phone || !guest.checkInDate || !guest.checkOutDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Send complete guest object to parent
    onCheckIn(room.roomNumber, guest as Guest);
    
    toast({
      title: "Check-in Successful",
      description: `${guest.name} has been checked in to Room ${room.roomNumber}`,
    });
    
    // Close dialog
    document.body.click();
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">
          Check In - Room {room.roomNumber} ({room.type})
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billNumber">Bill Number</Label>
              <Input
                id="billNumber"
                name="billNumber"
                value={guest.billNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Guest Name</Label>
              <Input
                id="name"
                name="name"
                value={guest.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={guest.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                name="paymentMethod" 
                onValueChange={(value) => setGuest((prev) => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                defaultValue={guest.paymentMethod as string}
              >
                <SelectTrigger>
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={guest.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">Check-in Date</Label>
              <Input
                id="checkInDate"
                name="checkInDate"
                type="date"
                value={guest.checkInDate instanceof Date 
                  ? guest.checkInDate.toISOString().split('T')[0] 
                  : new Date().toISOString().split('T')[0]}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Check-out Date</Label>
              <Input
                id="checkOutDate"
                name="checkOutDate"
                type="date"
                value={guest.checkOutDate instanceof Date 
                  ? guest.checkOutDate.toISOString().split('T')[0] 
                  : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                onChange={handleDateChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfAdults">Number of Adults</Label>
              <Input
                id="numberOfAdults"
                name="numberOfAdults"
                type="number"
                min="1"
                value={guest.numberOfAdults}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfChildren">Number of Children</Label>
              <Input
                id="numberOfChildren"
                name="numberOfChildren"
                type="number"
                min="0"
                value={guest.numberOfChildren}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyRent">Daily Rent (₹)</Label>
              <Input
                id="dailyRent"
                name="dailyRent"
                type="number"
                min="0"
                value={guest.dailyRent}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advancePaid">Advance Paid (₹)</Label>
              <Input
                id="advancePaid"
                name="advancePaid"
                type="number"
                min="0"
                value={guest.advancePaid}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>GST Type</Label>
            <RadioGroup 
              defaultValue={guest.taxIncluded ? "including" : "excluding"}
              onValueChange={(value) => setGuest((prev) => ({ ...prev, taxIncluded: value === "including" }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="including" id="including" />
                <Label htmlFor="including">Including</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excluding" id="excluding" />
                <Label htmlFor="excluding">Excluding</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gstRate">GST Rate (%)</Label>
            <Input
              id="gstRate"
              name="gstRate"
              type="number"
              min="0"
              max="100"
              value={guest.gstRate}
              onChange={handleChange}
            />
          </div>
          
          {summary && (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">Bill Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Stay Duration:</span>
                    <span>{summary.duration} day(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹ {summary.baseAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST ({guest.gstRate / 2}%):</span>
                    <span>₹ {summary.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST ({guest.gstRate / 2}%):</span>
                    <span>₹ {summary.sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>₹ {summary.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advance Paid:</span>
                    <span>₹ {summary.advancePaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Net Payable:</span>
                    <span>₹ {summary.netPayable.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="outline" onClick={() => document.body.click()}>
            Cancel
          </Button>
          <Button type="submit" className="gold-gradient text-primary hover:opacity-90 transition-opacity">
            Complete Check-in
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CheckInForm;
