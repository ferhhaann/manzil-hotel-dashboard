
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface Room {
  number: number;
  type: string;
  rate: number;
}

interface RoomSelectionFormProps {
  availableRooms: Room[];
  selectedRooms: number[];
  handleRoomToggle: (roomNumber: number, rate: number) => void;
}

const RoomSelectionForm: React.FC<RoomSelectionFormProps> = ({ 
  availableRooms, 
  selectedRooms, 
  handleRoomToggle 
}) => {
  const form = useFormContext();
  
  return (
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
  );
};

export default RoomSelectionForm;
