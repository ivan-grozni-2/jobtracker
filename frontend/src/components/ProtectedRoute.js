import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute(child) {
    const { user, loading } = useContext(AuthContext)
    const token = localStorage.getItem('accessToken');

    if (loading) return <p>Checking Session...</p>
    if (!user && !token) return <Navigate to='/login' />

    /**
    const token = localStorage.getItem('accessToken');
    if(!token){
        return <Navigate to="login"/>
    }
         */

    return child.children;
}

