
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { Reservation } from "@/types";
import ReservationDetails from "./ReservationDetails";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <Card className="w-full md:min-w-[300px]">
          <CardContent className="p-1 md:p-2">
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
                <div className="text-center text-xs space-y-2 mt-3 text-muted-foreground p-2 bg-muted/30 rounded-md">
                  <h4 className="font-medium text-sm mb-1">Calendar Legend</h4>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 bg-accent/30 rounded-sm"></div>
                    <span>Room is occupied on this date</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-l-4 border-green-500 pl-1 rounded-sm">|</div>
                    <span>Guest arrival / Check-in date</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-r-4 border-amber-500 pr-1 rounded-sm">|</div>
                    <span>Guest departure / Check-out date</span>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="pt-4 h-full">
            <h3 className="font-semibold text-lg mb-3 flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm md:text-lg">
                Reservations for {selectedDate ? format(selectedDate, "dd MMMM yyyy") : "Today"}
              </span>
              <Badge variant="outline" className="whitespace-nowrap">
                {reservationsForSelectedDate.length} reservation(s)
              </Badge>
            </h3>

            {reservationsForSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reservations for this date
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {reservationsForSelectedDate.map((reservation) => (
                  <Card
                    key={reservation.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedReservation(reservation)}
                  >
                    <CardContent className="p-3 flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{reservation.guestName}</h4>
                        <div className="text-xs text-muted-foreground">
                          Room(s): {reservation.roomNumbers.join(", ")}
                        </div>
                        <div className="text-xs">
                          {format(new Date(reservation.checkInDate), "dd MMM")} &rarr;{" "}
                          {format(new Date(reservation.checkOutDate), "dd MMM")}
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <Badge
                          className={
                            reservation.status === "Confirmed"
                              ? "bg-green-500"
                              : reservation.status === "Cancelled"
                              ? "bg-red-500"
                              : reservation.status === "Checked-in"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }
                        >
                          {reservation.status}
                        </Badge>
                        <div className="text-xs mt-1">
                          {isSameDay(new Date(reservation.checkInDate), selectedDate || new Date())
                            ? "Check-in today"
                            : isSameDay(new Date(reservation.checkOutDate), selectedDate || new Date())
                            ? "Check-out today"
                            : "Stay"}
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
