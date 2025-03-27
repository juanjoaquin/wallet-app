import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../services/authService";

export const ProtectedRoutes = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService();
        setUser(userData);
      } catch (error) {
        console.error("Error verifying token:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};