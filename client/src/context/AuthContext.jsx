import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../api/axios';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data.user);
                    setProfile(data.profile);
                } catch (err) {
                    localStorage.removeItem('token');
                    setAuthToken(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
            setSocket(newSocket);
            newSocket.emit('join', user._id);

            return () => newSocket.close();
        }
    }, [user]);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        // Fetch profile after login
        const profileRes = await api.get('/auth/me');
        setProfile(profileRes.data.profile);
        return res.data.user;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        const profileRes = await api.get('/auth/me');
        setProfile(profileRes.data.profile);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, register, logout, setUser, setProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
