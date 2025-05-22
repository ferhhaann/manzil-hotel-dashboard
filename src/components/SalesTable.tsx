
import React, { useState } from "react";
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
import { Search, Calendar, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Mock data - in a real app this would come from your backend
const initialSalesData = [
  {
    id: "S001",
    date: new Date(2025, 4, 1), // May 1, 2025
    billNumber: "MH230501001",
    guestName: "John Doe",
    customerName: "Self",
    roomNumber: 102,
    amount: 3000,
    expense: 500,
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "S002",
    date: new Date(2025, 4, 15), // May 15, 2025
    billNumber: "MH230501002",
    guestName: "Jane Smith",
    customerName: "ABC Company",
    roomNumber: 201,
    amount: 2000,
    expense: 300,
    paymentMethod: "Card",
    status: "Paid",
  },
  {
    id: "S003",
    date: new Date(2025, 4, 30), // May 30, 2025
    billNumber: "MH230501003",
    guestName: "Alex Johnson",
    customerName: "XYZ Corporation",
    roomNumber: 105,
    amount: 3500,
    expense: 700,
    paymentMethod: "UPI",
    status: "Pending",
  },
  {
    id: "S004",
    date: new Date(2025, 3, 15), // April 15, 2025
    billNumber: "MH230401001",
    guestName: "Emma Wilson",
    customerName: "Self",
    roomNumber: 302,
    amount: 4000,
    expense: 800,
    paymentMethod: "Card",
    status: "Paid",
  },
];

const SalesTable = () => {
  const [salesData] = useState(initialSalesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  
  // Generate arrays of months and years for filtering
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];
  
  // Filter data based on search term and date filters
  const filteredData = salesData.filter((sale) => {
    // Filter by search term
    const matchesSearch = 
      sale.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.roomNumber.toString().includes(searchTerm);
    
    // Filter by specific date if selected
    const matchesDate = selectedDate 
      ? sale.date.getDate() === selectedDate.getDate() && 
        sale.date.getMonth() === selectedDate.getMonth() && 
        sale.date.getFullYear() === selectedDate.getFullYear()
      : true;
    
    // Filter by month if selected
    const matchesMonth = selectedMonth && selectedMonth !== "all"
      ? sale.date.getMonth() === parseInt(selectedMonth)
      : true;
    
    // Filter by year if selected
    const matchesYear = selectedYear && selectedYear !== "all"
      ? sale.date.getFullYear() === parseInt(selectedYear)
      : true;
    
    return matchesSearch && matchesDate && matchesMonth && matchesYear;
  });
  
  // Calculate totals for the filtered data
  const totalSales = filteredData.reduce((total, sale) => total + sale.amount, 0);
  const totalExpenses = filteredData.reduce((total, sale) => total + sale.expense, 0);
  const netRevenue = totalSales - totalExpenses;
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by guest, customer, bill number..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="pointer-events-auto p-3"
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Month Filter */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {/* Fixed: Replaced empty string with "all" as value */}
              <SelectItem value="all">All Months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Year Filter */}
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {/* Fixed: Replaced empty string with "all" as value */}
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
            Clear Filters
          </Button>
        </div>
      </div>
      
      {/* Summary Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm font-medium">
        <div className="bg-green-50 p-3 rounded-md text-center">
          Total Sales: ₹ {totalSales.toLocaleString()}
        </div>
        <div className="bg-red-50 p-3 rounded-md text-center">
          Total Expenses: ₹ {totalExpenses.toLocaleString()}
        </div>
        <div className="bg-blue-50 p-3 rounded-md text-center">
          Net Revenue: ₹ {netRevenue.toLocaleString()}
        </div>
      </div>
      
      {/* Table */}
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
              <TableHead>Expense</TableHead>
              <TableHead>Net</TableHead>
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
                  <TableCell className="text-red-600">₹ {sale.expense.toLocaleString()}</TableCell>
                  <TableCell>₹ {(sale.amount - sale.expense).toLocaleString()}</TableCell>
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
                <TableCell colSpan={10} className="h-24 text-center">
                  No sales found matching the selected criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Buttons */}
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
