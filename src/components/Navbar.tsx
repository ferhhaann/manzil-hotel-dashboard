
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const user = getCurrentUser();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/aabbf551-1fea-4b30-9bdc-62fe62e54f5d.png" 
              alt="Manzil Hotel Logo" 
              className="h-10" 
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/dashboard') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/reservations" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/reservations') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
          >
            Reservations
          </Link>
          <Link 
            to="/reports" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/reports') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
          >
            Reports
          </Link>
          <Link 
            to="/finance" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/finance') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
          >
            Finance
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                Welcome, {user.name}
              </span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
