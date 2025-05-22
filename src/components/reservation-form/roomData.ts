
export interface Room {
  number: number;
  type: string;
  rate: number;
}

// Example room numbers for demonstration
export const availableRooms: Room[] = [
  { number: 101, type: "Deluxe", rate: 2000 },
  { number: 102, type: "Deluxe", rate: 2000 },
  { number: 103, type: "Deluxe", rate: 2000 },
  { number: 201, type: "Deluxe", rate: 2000 },
  { number: 301, type: "Premium", rate: 3000 },
  { number: 302, type: "Premium", rate: 3000 }
];
