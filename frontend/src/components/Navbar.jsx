import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectIsAuthenticated, selectCurrentUser } from "../store/authSlice";
import { Button } from "../components/ui/button";
import { Menu, X, User, LogOut, Heart, Home } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center font-bold text-xl" onClick={closeMobileMenu}>
            <Heart className="h-5 w-5 mr-2 text-primary" />
            <span>WishList</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-gray-600"
              }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <Link
                to="/wishlists"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/wishlists") ? "text-primary" : "text-gray-600"
                }`}
              >
                My Wishlists
              </Link>
            )}

            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{user?.name || user?.email || "User"}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </nav>

          <button onClick={toggleMobileMenu} className="md:hidden">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col py-4 space-y-4">
              <Link
                to="/"
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary" : "text-gray-600"
                }`}
                onClick={closeMobileMenu}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>

              {isAuthenticated && (
                <Link
                  to="/wishlists"
                  className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/wishlists") ? "text-primary" : "text-gray-600"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  My Wishlists
                </Link>
              )}

              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={closeMobileMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={closeMobileMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{user?.name || user?.email || "User"}</span>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
