import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { Reservation } from "@/types";
import ReservationDetails from "./ReservationDetails";
import { CalendarIcon } from "lucide-react";

interface ReservationCalendarProps {
  reservations: Reservation[];
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ reservations }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Find reservations for selected date
  const reservationsForSelectedDate = selectedDate
    ? reservations.filter(
        (r) =>
          (new Date(r.checkInDate) <= selectedDate &&
            new Date(r.checkOutDate) >= selectedDate) ||
          isSameDay(new Date(r.checkInDate), selectedDate) ||
          isSameDay(new Date(r.checkOutDate), selectedDate)
      )
    : [];

  // Calculate days with reservations for highlighting in calendar
  const daysWithReservations = reservations.reduce<Date[]>((acc, reservation) => {
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    
    // Create a date range from check-in to check-out
    for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
      acc.push(new Date(d));
    }
    
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="w-full md:min-w-[340px] shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Reservation Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full pointer-events-auto"
              modifiersStyles={{
                today: {
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "hsl(var(--primary))"
                }
              }}
              modifiers={{
                booked: daysWithReservations,
                checkIn: reservations.map(r => new Date(r.checkInDate)),
                checkOut: reservations.map(r => new Date(r.checkOutDate))
              }}
              modifiersClassNames={{
                booked: "bg-accent/30",
                checkIn: "border-l-4 border-green-500",
                checkOut: "border-r-4 border-amber-500"
              }}
              footer={
                <div className="text-center text-xs space-y-3 mt-4 text-muted-foreground p-3 bg-muted/30 rounded-md shadow-sm">
                  <h4 className="font-medium text-sm mb-2 text-foreground">Calendar Legend</h4>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 bg-accent/30 rounded-sm shadow-inner"></div>
                    <span>Room is occupied</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-l-4 border-green-500 pl-1 rounded-sm">|</div>
                    <span>Guest check-in</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-r-4 border-amber-500 pr-1 rounded-sm">|</div>
                    <span>Guest check-out</span>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm md:text-lg flex items-center gap-2">
                <span className="font-medium">
                  {selectedDate ? format(selectedDate, "dd MMMM yyyy") : "Today"}
                </span>
              </span>
              <Badge variant="outline" className="whitespace-nowrap text-sm bg-muted/50">
                {reservationsForSelectedDate.length} reservation(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-2 h-full max-w-[95%] mx-auto">
            {reservationsForSelectedDate.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
                <CalendarIcon className="h-12 w-12 opacity-20" />
                <span>No reservations for this date</span>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {reservationsForSelectedDate.map((reservation) => (
                  <Card
                    key={reservation.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                    style={{
                      borderTop: '6px solid',
                      borderTopColor: 
                        reservation.status === "Confirmed" ? "hsl(142.1, 76.2%, 36.3%)" :
                        reservation.status === "Cancelled" ? "hsl(0, 84.2%, 60.2%)" :
                        reservation.status === "Checked-in" ? "hsl(220, 70%, 50%)" :
                        "hsl(43, 100%, 50%)"
                    }}
                    onClick={() => setSelectedReservation(reservation)}
                  >
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-base">{reservation.guestName}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          Room(s): {reservation.roomNumbers.join(", ")}
                        </div>
                        <div className="text-xs mt-1 font-medium">
                          {format(new Date(reservation.checkInDate), "dd MMM")} &rarr;{" "}
                          {format(new Date(reservation.checkOutDate), "dd MMM")}
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-1 sm:mt-0 flex flex-col items-start sm:items-end">
                        <Badge
                          className={`${
                            reservation.status === "Confirmed"
                              ? "bg-green-500"
                              : reservation.status === "Cancelled"
                              ? "bg-red-500"
                              : reservation.status === "Checked-in"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          } shadow-sm`}
                        >
                          {reservation.status}
                        </Badge>
                        <div className="text-xs mt-2 px-2 py-1 bg-muted/50 rounded-full">
                          {isSameDay(new Date(reservation.checkInDate), selectedDate || new Date())
                            ? "Check-in today"
                            : isSameDay(new Date(reservation.checkOutDate), selectedDate || new Date())
                            ? "Check-out today"
                            : "Stay in progress"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reservation details dialog */}
      {selectedReservation && (
        <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
          <ReservationDetails reservation={selectedReservation} />
        </Dialog>
      )}
    </div>
  );
};

export default ReservationCalendar;
