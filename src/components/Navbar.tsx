import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Leaf, User } from "lucide-react";
import { Container } from "@/components/ui-components";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for token based authentication
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Get user info if available
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items that require authentication
  const protectedNavItems = [
    { name: "Buy Credits", path: "/buy-credits" },
    { name: "Sell Credits", path: "/sell-credits" },
    { name: "Calculator", path: "/calculator" },
    { name: "Analytics", path: "/analytics" },
    { name: "Education", path: "/education" },
    { name: "Forum", path: "/forum" },
  ];

  // Public navigation items (if any)
  const publicNavItems = [];

  // Show protected items only if logged in
  const navItems = isLoggedIn ? protectedNavItems : publicNavItems;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled || !isHomePage
          ? "bg-white/80 backdrop-blur-lg shadow-sm dark:bg-gray-900/80"
          : "bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-medium">Carbon Connect</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 text-sm rounded-md transition-all ${
                  location.pathname === item.path
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  <User className="h-5 w-5" />
                  {user.fullName || "User"}
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="button-hover">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="button-hover">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="button-hover">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>
      </Container>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-20 px-4 flex flex-col animate-fade-in md:hidden">
          <div className="flex flex-col gap-3 py-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`py-3 px-4 text-lg rounded-md transition-all ${
                  location.pathname === item.path
                    ? "bg-secondary font-medium"
                    : "hover:bg-secondary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px w-full bg-border my-2"></div>
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="py-3 px-4 text-lg rounded-md hover:bg-secondary flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  {user.fullName || "User"}
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-2 button-hover"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-3 px-4 text-lg rounded-md hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="lg" className="w-full mt-2 button-hover">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};