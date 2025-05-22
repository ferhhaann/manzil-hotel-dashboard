import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Reservation, ReservationStatus } from "@/types";
import { MoreHorizontal, FileEdit, XCircle, Eye, CheckCircle } from "lucide-react";
import ReservationDetails from "./ReservationDetails";
import EditReservationForm from "./EditReservationForm";
import CancelReservationDialog from "./CancelReservationDialog";

interface ReservationsListProps {
  reservations: Reservation[];
  onCancel: (reservationId: string) => void;
  onUpdate: (reservation: Reservation) => void;
}

const getStatusBadge = (status: ReservationStatus) => {
  switch (status) {
    case "Confirmed":
      return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
    case "Pending":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
    case "Cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
    case "Checked-in":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Checked-in</Badge>;
    case "Checked-out":
      return <Badge className="bg-gray-500 hover:bg-gray-600">Checked-out</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const getPaymentStatusBadge = (status: "Pending" | "Partially Paid" | "Paid") => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
    case "Partially Paid":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Partially Paid</Badge>;
    case "Pending":
      return <Badge className="bg-red-500 hover:bg-red-600">Pending</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const ReservationsList: React.FC<ReservationsListProps> = ({
  reservations,
  onCancel,
  onUpdate,
}) => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit" | "cancel">("view");

  // Filter out reservations that need attention (pending payments, upcoming check-ins)
  const needsAttention = reservations.filter(r => 
    r.paymentStatus !== "Paid" || 
    (r.status === "Confirmed" && 
     new Date(r.checkInDate).toDateString() === new Date().toDateString())
  );

  // Rest of the reservations
  const otherReservations = reservations.filter(r => 
    !needsAttention.some(na => na.id === r.id)
  );

  // Handle view details
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewMode("view");
  };

  // Handle edit
  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewMode("edit");
  };

  // Handle cancel
  const handleCancelIntent = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewMode("cancel");
  };

  // Render reservation row
  const renderReservationRow = (reservation: Reservation, needsAttention: boolean = false) => (
    <TableRow key={reservation.id} className={needsAttention ? "bg-amber-50" : ""}>
      <TableCell className="font-medium">{reservation.id}</TableCell>
      <TableCell>{reservation.guestName}</TableCell>
      <TableCell>{format(new Date(reservation.checkInDate), "dd MMM yyyy")}</TableCell>
      <TableCell>{format(new Date(reservation.checkOutDate), "dd MMM yyyy")}</TableCell>
      <TableCell>{reservation.roomNumbers.join(", ")}</TableCell>
      <TableCell>{getStatusBadge(reservation.status)}</TableCell>
      <TableCell>{getPaymentStatusBadge(reservation.paymentStatus)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(reservation)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            
            {reservation.status !== "Cancelled" && reservation.status !== "Checked-out" && (
              <>
                <DropdownMenuItem onClick={() => handleEdit(reservation)}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={() => handleCancelIntent(reservation)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </>
            )}
            
            {reservation.status === "Confirmed" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Check-in functionality to be implemented")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check-in
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      {/* Action dialogs */}
      {selectedReservation && (
        <>
          <Dialog open={viewMode === "view"} onOpenChange={(open) => !open && setSelectedReservation(null)}>
            <ReservationDetails reservation={selectedReservation} />
          </Dialog>

          <Dialog open={viewMode === "edit"} onOpenChange={(open) => !open && setSelectedReservation(null)}>
            <EditReservationForm 
              reservation={selectedReservation} 
              onUpdate={(updated) => {
                onUpdate(updated);
                setSelectedReservation(null);
              }} 
            />
          </Dialog>

          <Dialog open={viewMode === "cancel"} onOpenChange={(open) => !open && setSelectedReservation(null)}>
            <CancelReservationDialog 
              reservation={selectedReservation}
              onCancel={() => {
                onCancel(selectedReservation.id);
                setSelectedReservation(null);
              }}
              onClose={() => setSelectedReservation(null)}
            />
          </Dialog>
        </>
      )}

      {/* Reservations table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reservation ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Room(s)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {needsAttention.length > 0 && (
              <>
                {/* Needs attention section */}
                <TableRow>
                  <TableCell colSpan={8} className="bg-amber-100 font-semibold py-1">
                    Needs Attention
                  </TableCell>
                </TableRow>
                {needsAttention.map((reservation) => renderReservationRow(reservation, true))}
                
                {/* Other reservations section */}
                <TableRow>
                  <TableCell colSpan={8} className="bg-gray-100 font-semibold py-1">
                    Other Reservations
                  </TableCell>
                </TableRow>
              </>
            )}
            
            {otherReservations.map((reservation) => renderReservationRow(reservation))}
            
            {/* No reservations state */}
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No reservations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReservationsList;
