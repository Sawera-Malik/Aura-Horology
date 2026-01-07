import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (access: string, refresh: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async (token: string) => {
        try {
            // The interceptor will add the Authorization header
            const response = await api.get('/auth/user/');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken && !user) {
            fetchUser(accessToken);
        } else if (!accessToken) {
            setIsLoading(false);
        }
    }, [accessToken, user]);

    const login = async (access: string, refresh: string) => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setAccessToken(access);
        await fetchUser(access);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setUser(null);
        setIsLoading(false);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
