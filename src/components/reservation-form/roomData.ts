
export interface Room {
  number: number;
  type: string;
  rate: number;
}

// 14 rooms for demonstration
export const availableRooms: Room[] = [
  { number: 101, type: "Deluxe", rate: 2000 },
  { number: 102, type: "Deluxe", rate: 2000 },
  { number: 103, type: "Deluxe", rate: 2000 },
  { number: 104, type: "Deluxe", rate: 2000 },
  { number: 105, type: "Deluxe", rate: 2000 },
  { number: 201, type: "Deluxe", rate: 2000 },
  { number: 202, type: "Deluxe", rate: 2000 },
  { number: 203, type: "Premium", rate: 3000 },
  { number: 204, type: "Premium", rate: 3000 },
  { number: 301, type: "Premium", rate: 3000 },
  { number: 302, type: "Premium", rate: 3000 },
  { number: 303, type: "Premium", rate: 3000 },
  { number: 401, type: "Executive Suite", rate: 5000 },
  { number: 402, type: "Executive Suite", rate: 5000 }
];
