
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
