import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/authSlice";
import { Navbar, Footer } from "./components";
import {
  HomePage,
  LoginPage,
  SignupPage,
  WishlistsPage,
  WishlistDetailsPage,
  NotFoundPage,
} from "./pages";
import { Toaster } from "./components/ui/sonner";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/wishlists"
            element={
              <ProtectedRoute>
                <WishlistsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlists/:id"
            element={
              <ProtectedRoute>
                <WishlistDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
