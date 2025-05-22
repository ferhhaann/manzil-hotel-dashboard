
import React from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface SalesTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedMonth: string | undefined;
  setSelectedMonth: (month: string) => void;
  selectedYear: string | undefined;
  setSelectedYear: (year: string) => void;
  clearFilters: () => void;
  months: { value: string; label: string }[];
  years: string[];
}

const SalesTableFilters: React.FC<SalesTableFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  clearFilters,
  months,
  years
}) => {
  return (
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
  );
};

export default SalesTableFilters;
