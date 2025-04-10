import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token =localStorage.getItem('token');
    console.log('ProtectedRoute: token exists?', !!token);
    console.log('ProtectedRoute: current token', token);
    if (!token){
        console.log('ProtectedRoute: redirecting to /login');
        return <Navigate to = "/login" />;
    }
    return children;
};

export default ProtectedRoute;