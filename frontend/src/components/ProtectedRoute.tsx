import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    adminOnly?: boolean;
    userOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false, userOnly = false }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If route is admin only and user is not admin
    if (adminOnly && !user.is_staff) {
        return <Navigate to="/" replace />;
    }

    // If route is user only and user is admin
    // "admin ko bhi baki page show na hon" -> Admin should not see user pages like /cart, /orders
    if (userOnly && user.is_staff) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
