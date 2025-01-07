import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GetTask from '../pages/GetTask';
import AdminDashboardTareas from '../pages/AdminDashboardTareas';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-tareas" element={<ProtectedRoute requiredRole="admin"><AdminDashboardTareas /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute requiredRole="user"><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/get-task/:id" element={<ProtectedRoute requiredRole="user"><GetTask /></ProtectedRoute>} />
      <Route path="/admin-get-task/:id" element={<ProtectedRoute requiredRole="admin"><GetTask /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

