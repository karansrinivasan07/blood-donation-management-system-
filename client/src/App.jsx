import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Lazy load pages with chunk error handling
const lazyWithRetry = (componentImport) => React.lazy(async () => {
    try {
        return await componentImport();
    } catch (error) {
        if (error.message.includes('Failed to fetch dynamically imported module')) {
            window.location.reload();
        }
        throw error;
    }
});

const Home = lazyWithRetry(() => import('./pages/Home'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Register = lazyWithRetry(() => import('./pages/Register'));
const DonorDashboard = lazyWithRetry(() => import('./pages/donor/Dashboard'));
const DonorProfile = lazyWithRetry(() => import('./pages/donor/Profile'));
const MyPledges = lazyWithRetry(() => import('./pages/donor/MyPledges'));
const RequestDetails = lazyWithRetry(() => import('./pages/donor/RequestDetails'));
const HospitalDashboard = lazyWithRetry(() => import('./pages/hospital/Dashboard'));
const CreateRequest = lazyWithRetry(() => import('./pages/hospital/CreateRequest'));
const HospitalRequestDetails = lazyWithRetry(() => import('./pages/hospital/RequestDetails'));
const HospitalProfile = lazyWithRetry(() => import('./pages/hospital/Profile'));
const AdminUsers = lazyWithRetry(() => import('./pages/admin/Users'));
const AdminRequests = lazyWithRetry(() => import('./pages/admin/Requests'));
const AdminAnalytics = lazyWithRetry(() => import('./pages/admin/Analytics'));


const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-medical-light">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        <React.Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-medical-primary border-t-transparent rounded-full animate-spin"></div></div>}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Donor Routes */}
                                <Route element={<ProtectedRoute allowedRoles={['DONOR']} />}>
                                    <Route path="/donor/dashboard" element={<DonorDashboard />} />
                                    <Route path="/donor/profile" element={<DonorProfile />} />
                                    <Route path="/donor/my-pledges" element={<MyPledges />} />
                                    <Route path="/donor/requests/:id" element={<RequestDetails />} />
                                </Route>

                                {/* Hospital Routes */}
                                <Route element={<ProtectedRoute allowedRoles={['HOSPITAL']} />}>
                                    <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
                                    <Route path="/hospital/create-request" element={<CreateRequest />} />
                                    <Route path="/hospital/requests/:id" element={<HospitalRequestDetails />} />
                                    <Route path="/hospital/profile" element={<HospitalProfile />} />
                                </Route>

                                {/* Admin Routes */}
                                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                    <Route path="/admin/users" element={<AdminUsers />} />
                                    <Route path="/admin/requests" element={<AdminRequests />} />
                                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                                </Route>

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </React.Suspense>
                    </main>
                    <Toaster position="bottom-right" />
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
