// src/components/Manufacturer/Dashboard/ManufacturerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../sidebar';
import ManufacturerHome from './ManufacturerHome'; 
import Orders from '../Orders/OrderList'; 
import Products from '../Products/ProductList'; 
import '../../Manufacturer/manufacturer.css';
import NotificationBar  from '../NotificationBar';


const ManufacturerDashboard = () => {
  return (
 <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <NotificationBar />
        <Routes>
          <Route path="/" element={<ManufacturerHome />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
        </Routes>
      </Box>
    </Box>
   
  );
};

export default ManufacturerDashboard;
