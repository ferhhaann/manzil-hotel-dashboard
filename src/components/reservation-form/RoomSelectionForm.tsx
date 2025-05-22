
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
  const [customRates, setCustomRates] = useState<{[key: number]: number}>({});
  
  const handleRateChange = (roomNumber: number, newRate: number) => {
    setCustomRates(prev => ({
      ...prev,
      [roomNumber]: newRate
    }));
    
    // If room is already selected, update its rate
    if (selectedRooms.includes(roomNumber)) {
      handleRoomToggle(roomNumber, newRate);
    }
  };
  
  const toggleRoom = (room: Room) => {
    const rate = customRates[room.number] || room.rate;
    handleRoomToggle(room.number, rate);
  };
  
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Room Selection</h3>
      <FormField
        control={form.control}
        name="roomNumbers"
        render={() => (
          <FormItem>
            <div className="max-h-[300px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableRooms.map(room => (
                  <Card key={room.number} className={`border ${selectedRooms.includes(room.number) ? 'border-primary' : 'border-muted'}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">Room {room.number}</span>
                          <span className="text-xs text-muted-foreground">{room.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24">
                            <Input
                              type="number"
                              value={customRates[room.number] || room.rate}
                              onChange={(e) => handleRateChange(room.number, Number(e.target.value))}
                              className="h-8 text-sm"
                              min={0}
                            />
                          </div>
                          <Button
                            type="button"
                            variant={selectedRooms.includes(room.number) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleRoom(room)}
                            className="h-8 min-w-[80px]"
                          >
                            {selectedRooms.includes(room.number) ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RoomSelectionForm;
