import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // If no token is found, redirect to login
  if (!token) {
    // Save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If token exists, allow access to the protected route
  return <>{children}</>;
};

export default ProtectedRoute;