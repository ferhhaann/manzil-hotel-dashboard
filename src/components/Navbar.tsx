
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const user = getCurrentUser();
  const { toast } = useToast();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-primary text-primary-foreground shadow-md">
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

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-primary-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/dashboard') ? 'border-b-2 border-primary-foreground font-bold' : 'hover:text-secondary-foreground'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/reservations" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/reservations') ? 'border-b-2 border-primary-foreground font-bold' : 'hover:text-secondary-foreground'}`}
          >
            Reservations
          </Link>
          <Link 
            to="/reports" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/reports') ? 'border-b-2 border-primary-foreground font-bold' : 'hover:text-secondary-foreground'}`}
          >
            Reports
          </Link>
          <Link 
            to="/finance" 
            className={`text-sm font-medium transition-colors ${isActiveRoute('/finance') ? 'border-b-2 border-primary-foreground font-bold' : 'hover:text-secondary-foreground'}`}
          >
            Finance
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-primary border-b shadow-lg md:hidden">
            <nav className="flex flex-col py-4">
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 text-sm font-medium ${isActiveRoute('/dashboard') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/reservations" 
                className={`px-4 py-2 text-sm font-medium ${isActiveRoute('/reservations') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Reservations
              </Link>
              <Link 
                to="/reports" 
                className={`px-4 py-2 text-sm font-medium ${isActiveRoute('/reports') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Reports
              </Link>
              <Link 
                to="/finance" 
                className={`px-4 py-2 text-sm font-medium ${isActiveRoute('/finance') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Finance
              </Link>
              {user && (
                <div className="px-4 py-2 border-t border-accent mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-transparent text-primary-foreground border-primary-foreground hover:bg-accent/50"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}

        <div className="hidden md:flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                Welcome, {user.name}
              </span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-accent/50"
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
