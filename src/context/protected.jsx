// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const session = localStorage.getItem('admin_session');
      
      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const sessionData = JSON.parse(session);
      const now = new Date().getTime();
      
      if (now > sessionData.expiresAt) {
        // Session expired
        localStorage.removeItem('admin_session');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;