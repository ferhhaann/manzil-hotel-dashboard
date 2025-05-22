
import { User } from "../types";

// Mock users for demonstration
const USERS: User[] = [
  {
    id: "1",
    username: "admin",
    name: "Admin User",
    role: "admin"
  },
  {
    id: "2",
    username: "staff",
    name: "Staff User",
    role: "staff"
  }
];

// In a real app, this would be a secure authentication process
export const authenticate = (username: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    // For demo purposes, we'll just check if the username exists and password is "password"
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && password === "password");
      if (user) {
        // Store in session storage
        sessionStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  sessionStorage.removeItem("user");
  window.location.href = "/";
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
