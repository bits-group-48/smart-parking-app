"use client"
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Car, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";


export const Navbar = () => {
  const location = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  
  const isActive = (path: string) => location == path;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };
  
  // Filter nav items based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Home" },
      { path: "/dashboard", label: "Dashboard" },
      { path: "/parking", label: "Parking" },
      { path: "/bookings", label: "My Bookings" },
    ];
    
    // Only show admin link if user is admin
    if (session?.user?.role === "admin") {
      baseItems.push({ path: "/admin", label: "Admin" });
    }
    
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              SmartPark
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-blue-500" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-blue-500">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>


        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 text-sm font-medium ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              {status === "loading" ? (
                <div className="h-9 w-full bg-muted animate-pulse rounded-md"></div>
              ) : session?.user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="w-full bg-blue-500" asChild>
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

