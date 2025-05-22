
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { Reservation, PaymentMethod } from "@/types";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { v4 as uuidv4 } from '@tanstack/react-query';

interface NewReservationFormProps {
  onSubmit: (reservation: Reservation) => void;
}

// Example room numbers for demonstration
const availableRooms = [
  { number: 101, type: "Deluxe", rate: 2000 },
  { number: 102, type: "Deluxe", rate: 2000 },
  { number: 103, type: "Deluxe", rate: 2000 },
  { number: 201, type: "Deluxe", rate: 2000 },
  { number: 301, type: "Premium", rate: 3000 },
  { number: 302, type: "Premium", rate: 3000 }
];

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
          <div className="space-y-4">
            <h3 className="font-semibold">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestName"
                rules={{ required: "Guest name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Guest name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestPhone"
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Source</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Direct">Direct</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="OTA">OTA</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Walk-in">Walk-in</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkInDate"
                rules={{ required: "Check-in date is required" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            handleDateChange();
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="checkOutDate"
                rules={{ required: "Check-out date is required" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            handleDateChange();
                          }}
                          disabled={(date) => 
                            date <= form.getValues("checkInDate") || 
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adults"
                rules={{ required: "Number of adults is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adults</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Children</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any special requests or requirements"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Room Selection</h3>
            <FormField
              control={form.control}
              name="roomNumbers"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableRooms.map(room => (
                      <Button
                        key={room.number}
                        type="button"
                        variant={selectedRooms.includes(room.number) ? "default" : "outline"}
                        className="h-auto py-2 px-3 flex flex-col items-start"
                        onClick={() => handleRoomToggle(room.number, room.rate)}
                      >
                        <span className="font-medium">Room {room.number}</span>
                        <span className="text-xs">{room.type} - ₹{room.rate}/night</span>
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="advanceAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Payment</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        max={totalAmount}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Total: ₹{totalAmount}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
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
