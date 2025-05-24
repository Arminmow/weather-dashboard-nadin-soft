import { Navigate } from "react-router-dom";
import AuthService from "../auth/authService";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!AuthService.isLoggedIn()) return <Navigate to="/login" />;
  return children;
};
