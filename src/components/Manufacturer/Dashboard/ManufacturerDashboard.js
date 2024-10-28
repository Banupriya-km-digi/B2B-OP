// src/components/Manufacturer/Dashboard/ManufacturerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../sidebar';
import ManufacturerHome from './ManufacturerHome'; 
import Orders from '../Orders/OrderList'; 
import Products from '../Products/ProductList'; 
import '../../Manufacturer/manufacturer.css';

const ManufacturerDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<ManufacturerHome />} /> {/* Default route for Dashboard */}
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ManufacturerDashboard;
