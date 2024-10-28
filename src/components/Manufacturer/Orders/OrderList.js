// src/components/Manufacturer/Orders/OrderList.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';
import '../../Manufacturer/manufacturer.css';

const OrderList = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate(); // Initialize useNavigate
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      // Check if the user is defined and has a manufacture_unit_id
      if (!user || !user.manufacture_unit_id) {
        console.error("User or manufacture_unit_id is not defined.");
        return;
      }

      try {
        const response = await axios.get('http://192.168.1.14:8000/app/obtainOrderList/', {
          params: { manufacture_unit_id: user.manufacture_unit_id },
        });
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user.manufacture_unit_id]); // Only run the effect when manufacture_unit_id changes

  const handleFilter = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
    setPage(0); // Reset to the first page when filter changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`); // Navigate to the order detail page with orderId
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component={Paper} sx={{ p: 2, flexGrow: 1 }}>
        <Box mb={2}>
          <Button variant="contained" onClick={() => handleFilter('all')}>All Orders</Button>
          <Button variant="contained" onClick={() => handleFilter('pending')} sx={{ ml: 1 }}>Pending</Button>
          <Button variant="contained" onClick={() => handleFilter('shipped')} sx={{ ml: 1 }}>Shipped</Button>
          <Button variant="contained" onClick={() => handleFilter('completed')} sx={{ ml: 1 }}>Completed</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Dealer Name</TableCell>
                <TableCell>Order Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow 
                  key={order.order_id} 
                  onClick={() => handleRowClick(order.order_id)} // Navigate on row click
                  style={{ cursor: 'pointer' }} // Change cursor to pointer for better UX
                >
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.dealer_anme}</TableCell>
                  <TableCell>{order.order_value}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default OrderList;
