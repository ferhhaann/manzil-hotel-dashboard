
import { Guest, BillSummary } from "../types";

export function calculateBill(guest: Guest): BillSummary {
  const checkIn = new Date(guest.checkInDate);
  const checkOut = new Date(guest.checkOutDate);
  
  // Calculate duration in days
  const duration = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

  let baseAmount: number;
  let totalAmount: number;
  let taxAmount: number;
  
  if (guest.taxIncluded) {
    // If tax is included in the total
    totalAmount = guest.dailyRent * duration;
    baseAmount = totalAmount / (1 + (guest.gstRate / 100));
    taxAmount = totalAmount - baseAmount;
  } else {
    // If tax is excluded from the base amount
    baseAmount = guest.dailyRent * duration;
    taxAmount = baseAmount * (guest.gstRate / 100);
    totalAmount = baseAmount + taxAmount;
  }
  
  // Split GST between CGST and SGST
  const cgst = taxAmount / 2;
  const sgst = taxAmount / 2;
  
  // Calculate net amount payable
  const netPayable = totalAmount - guest.advancePaid;
  
  return {
    duration,
    baseAmount: Math.round(baseAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    totalTax: Math.round(taxAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    advancePaid: guest.advancePaid,
    netPayable: Math.round(netPayable * 100) / 100
  };
}

export function generateBillNumber(): string {
  const prefix = "MH";
  const date = new Date();
  const dateStr = date.getFullYear().toString().slice(-2) + 
    (date.getMonth() + 1).toString().padStart(2, '0') + 
    date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${dateStr}${random}`;
}
