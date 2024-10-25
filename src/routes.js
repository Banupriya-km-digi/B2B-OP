// src\routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import DealerDashboard from './components/DealerDashboard';
import ManufacturerDashboard from './components/ManufacturerDashboard';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/super_admin"
          element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/dealer"
          element={
            <PrivateRoute allowedRoles={['dealer_admin']}>
              <DealerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/manufacturer"
          element={
            <PrivateRoute allowedRoles={['manufacturer_admin']}>
              <ManufacturerDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
