import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard';
import DonorProfile from './pages/donor/Profile';
import MyPledges from './pages/donor/MyPledges';
import RequestDetails from './pages/donor/RequestDetails';

// Hospital Pages
import HospitalDashboard from './pages/hospital/Dashboard';
import CreateRequest from './pages/hospital/CreateRequest';
import HospitalRequestDetails from './pages/hospital/RequestDetails';
import HospitalProfile from './pages/hospital/Profile';

// Admin Pages
import AdminUsers from './pages/admin/Users';
import AdminRequests from './pages/admin/Requests';
import AdminAnalytics from './pages/admin/Analytics';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-medical-light">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
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
                    </main>
                    <Toaster position="bottom-right" />
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
