
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Landmark } from "lucide-react";

interface RevenueSummaryProps {
  totalSales: number;
  totalExpenses: number;
  revenue: number;
  month: string;
}

const RevenueSummary = ({ totalSales, totalExpenses, revenue, month }: RevenueSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium leading-none text-muted-foreground mb-1">Total Sales</p>
              <h3 className="text-2xl font-bold">₹ {totalSales.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <ArrowUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{month}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium leading-none text-muted-foreground mb-1">Total Expenses</p>
              <h3 className="text-2xl font-bold">₹ {totalExpenses.toLocaleString()}</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <ArrowDown className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{month}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium leading-none text-muted-foreground mb-1">Net Revenue</p>
              <h3 className="text-2xl font-bold">₹ {revenue.toLocaleString()}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Landmark className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{month}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueSummary;
