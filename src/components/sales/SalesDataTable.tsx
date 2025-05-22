
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Sale {
  id: string;
  date: Date;
  billNumber: string;
  guestName: string;
  customerName: string;
  roomNumber: number;
  amount: number;
  paymentMethod: string;
  status: string;
}

interface SalesDataTableProps {
  filteredData: Sale[];
}

const SalesDataTable: React.FC<SalesDataTableProps> = ({ filteredData }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Bill #</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                <TableCell className="font-medium">{sale.billNumber}</TableCell>
                <TableCell>{sale.guestName}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>{sale.roomNumber}</TableCell>
                <TableCell>₹ {sale.amount.toLocaleString()}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sale.status === "Paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {sale.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No sales found matching the selected criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesDataTable;
