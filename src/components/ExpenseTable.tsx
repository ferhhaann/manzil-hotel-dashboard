
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

// Mock data - in a real app this would come from your backend
const initialExpensesData = [
  {
    id: "E001",
    date: new Date(),
    category: "Food & Beverage",
    description: "Groceries for kitchen",
    amount: 5000,
    paidBy: "John Manager",
    paymentMethod: "Cash",
    reference: "INV-001",
  },
  {
    id: "E002",
    date: new Date(),
    category: "Utilities",
    description: "Electricity bill for April",
    amount: 15000,
    paidBy: "Finance Department",
    paymentMethod: "Bank Transfer",
    reference: "ELEC-APR-23",
  },
  {
    id: "E003",
    date: new Date(),
    category: "Maintenance",
    description: "Plumbing repairs",
    amount: 2500,
    paidBy: "Maintenance Staff",
    paymentMethod: "Cash",
    reference: "",
  },
];

const ExpenseTable = () => {
  const [expensesData, setExpensesData] = useState(initialExpensesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Filter data based on search term and category
  const filteredData = expensesData.filter((expense) => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paidBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for the filter
  const categories = Array.from(new Set(expensesData.map((expense) => expense.category)));
  
  // Calculate total expenses
  const totalExpenses = filteredData.reduce((total, expense) => total + expense.amount, 0);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="text-sm font-medium text-right">
        Total Expenses: ₹ {totalExpenses.toFixed(2)}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), "dd MMM yyyy")}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>₹ {expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.paidBy}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>
                    {expense.reference || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          Export as CSV
        </Button>
        <Button variant="outline">
          Print Report
        </Button>
      </div>
    </div>
  );
};

export default ExpenseTable;
