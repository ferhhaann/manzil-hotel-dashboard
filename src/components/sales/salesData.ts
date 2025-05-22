
export interface Sale {
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

// Example sales data for demonstration
export const initialSalesData: Sale[] = [
  {
    id: "S001",
    date: new Date(2025, 4, 1), // May 1, 2025
    billNumber: "MH230501001",
    guestName: "John Doe",
    customerName: "Self",
    roomNumber: 102,
    amount: 3000,
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
    paymentMethod: "Card",
    status: "Paid",
  },
];
