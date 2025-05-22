
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";

const ExpensesTabContent = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Expenses List</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTabContent;
