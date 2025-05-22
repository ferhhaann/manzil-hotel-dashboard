
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SalesTableFilters from "./sales/SalesTableFilters";
import SalesDataTable from "./sales/SalesDataTable";
import { initialSalesData } from "./sales/salesData";

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
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
  };
  
  return (
    <div className="space-y-4">
      <SalesTableFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        clearFilters={clearFilters}
        months={months}
        years={years}
      />
      
      {/* Summary Display */}
      <div className="grid grid-cols-1 gap-2 text-sm font-medium">
        <div className="bg-green-50 p-3 rounded-md text-center">
          Total Sales: ₹ {totalSales.toLocaleString()}
        </div>
      </div>
      
      <SalesDataTable filteredData={filteredData} />
      
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
