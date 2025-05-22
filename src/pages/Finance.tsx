
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SalesTable from "@/components/SalesTable";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueSummary from "@/components/RevenueSummary";

const Finance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);
  
  // Mock data for summary - in a real app, this would come from your API
  const financialSummary = {
    totalSales: 8500,
    totalExpenses: 3000,
    revenue: 5500,
    month: "May 2025"
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Financial Management</h1>
          
          <RevenueSummary 
            totalSales={financialSummary.totalSales}
            totalExpenses={financialSummary.totalExpenses}
            revenue={financialSummary.revenue}
            month={financialSummary.month}
          />
          
          <Tabs defaultValue="sales" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <SalesTable />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="expenses" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Finance;
