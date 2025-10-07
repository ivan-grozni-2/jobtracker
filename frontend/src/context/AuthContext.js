import React, { createContext, useState, useEffect } from 'react';
import { refreshToken, logout as apiLogout } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    setUser({});
                }
                else {
                    try {
                        const newToken = await refreshToken();
                        if (newToken) setUser({})
                        console.log(user)
                    } catch (err) {
                        console.warn('session expired')
                    }
                }
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    async function handleLogout() {
        try {
            await apiLogout();
        } catch (err) {
            console.warn('Logout error', err.message)
        }

        localStorage.removeItem('accessToken');
        setUser(null);

    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout: handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    )


}