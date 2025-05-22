
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Cleaning';

export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';

export type RoomType = 'Premium' | 'Deluxe';

export interface Guest {
  billNumber: string;
  name: string;
  phone: string;
  address: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfAdults: number;
  numberOfChildren: number;
  dailyRent: number;
  advancePaid: number;
  paymentMethod: PaymentMethod;
  gstRate: number;
  taxIncluded: boolean;
}

export interface Room {
  roomNumber: number;
  type: RoomType;
  status: RoomStatus;
  guest?: Guest | null;
}

export interface BillSummary {
  duration: number;
  baseAmount: number;
  cgst: number;
  sgst: number;
  totalTax: number;
  totalAmount: number;
  advancePaid: number;
  netPayable: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'staff';
}

// New reservation-related types
export type ReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Checked-in' | 'Checked-out';

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumbers: number[];
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: 'Pending' | 'Partially Paid' | 'Paid';
  paymentMethod: PaymentMethod;
  source: 'Direct' | 'Website' | 'OTA' | 'Phone' | 'Walk-in';
}
