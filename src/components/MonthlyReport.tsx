
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room, Guest } from "@/types";
import { calculateBill } from "@/utils/calculateBill";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyReportProps {
  rooms: Room[];
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ rooms }) => {
  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Filter check-ins from the current month
  const currentMonthBookings = rooms
    .filter(room => room.guest)
    .filter(room => {
      const checkInDate = new Date(room.guest!.checkInDate);
      return checkInDate.getMonth() === currentMonth && 
             checkInDate.getFullYear() === currentYear;
    });
  
  // Calculate total revenue, GST, etc.
  let totalRevenue = 0;
  let totalGst = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalBookings = currentMonthBookings.length;
  
  currentMonthBookings.forEach(room => {
    if (room.guest) {
      const bill = calculateBill(room.guest);
      totalRevenue += bill.totalAmount;
      totalGst += bill.totalTax;
      totalCgst += bill.cgst;
      totalSgst += bill.sgst;
    }
  });
  
  const averageSalePerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  
  // Generate daily data for the chart
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayBookings = currentMonthBookings.filter(room => {
      const checkInDate = new Date(room.guest!.checkInDate);
      return checkInDate.getDate() === day;
    });
    
    const dayRevenue = dayBookings.reduce((sum, room) => {
      if (room.guest) {
        const bill = calculateBill(room.guest);
        return sum + bill.totalAmount;
      }
      return sum;
    }, 0);
    
    return {
      day,
      revenue: dayRevenue,
      bookings: dayBookings.length,
    };
  });
  
  // Generate room type data for chart
  const roomTypeData = [
    {
      name: "Premium",
      count: rooms.filter(room => room.type === "Premium").length,
      occupied: rooms.filter(room => room.type === "Premium" && room.status === "Occupied").length,
    },
    {
      name: "Deluxe",
      count: rooms.filter(room => room.type === "Deluxe").length,
      occupied: rooms.filter(room => room.type === "Deluxe" && room.status === "Occupied").length,
    },
  ];
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Monthly Report - {monthNames[currentMonth]} {currentYear}
      </h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹ {totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Sale Per Stay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹ {averageSalePerBooking.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total GST Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹ {totalGst.toFixed(2)}</p>
            <div className="text-sm text-muted-foreground mt-2">
              <div>CGST: ₹ {totalCgst.toFixed(2)}</div>
              <div>SGST: ₹ {totalSgst.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue (₹)" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Room Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomTypeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Total Rooms" fill="hsl(var(--primary))" />
                <Bar dataKey="occupied" name="Occupied Rooms" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyReport;
