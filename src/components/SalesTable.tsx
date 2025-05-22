
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - in a real app this would come from your backend
const initialSalesData = [
  {
    id: "S001",
    date: new Date(),
    billNumber: "MH230501001",
    guestName: "John Doe",
    roomNumber: 102,
    amount: 3000,
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "S002",
    date: new Date(),
    billNumber: "MH230501002",
    guestName: "Jane Smith",
    roomNumber: 201,
    amount: 2000,
    paymentMethod: "Card",
    status: "Paid",
  },
  {
    id: "S003",
    date: new Date(),
    billNumber: "MH230501003",
    guestName: "Alex Johnson",
    roomNumber: 105,
    amount: 3500,
    paymentMethod: "UPI",
    status: "Pending",
  },
];

const SalesTable = () => {
  const [salesData, setSalesData] = useState(initialSalesData);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter data based on search term
  const filteredData = salesData.filter((sale) =>
    sale.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.roomNumber.toString().includes(searchTerm)
  );
  
  // Calculate total sales amount
  const totalSales = filteredData.reduce((total, sale) => total + sale.amount, 0);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by guest name, bill number..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="text-sm font-medium">
          Total Sales: ₹ {totalSales.toFixed(2)}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Bill #</TableHead>
              <TableHead>Guest</TableHead>
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
                  <TableCell>{format(new Date(sale.date), "dd MMM yyyy HH:mm")}</TableCell>
                  <TableCell className="font-medium">{sale.billNumber}</TableCell>
                  <TableCell>{sale.guestName}</TableCell>
                  <TableCell>{sale.roomNumber}</TableCell>
                  <TableCell>₹ {sale.amount.toFixed(2)}</TableCell>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  No sales found for today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2">
          Export as CSV
        </Button>
        <Button variant="outline">
          Print Report
        </Button>
      </div>
    </div>
  );
};

export default SalesTable;
