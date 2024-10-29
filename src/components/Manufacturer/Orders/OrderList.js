// src/components/Manufacturer/Orders/OrderList.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Menu,
  MenuItem,
} from '@mui/material';
import '../../Manufacturer/manufacturer.css';

const OrderList = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
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
  }, [user.manufacture_unit_id]);

  useEffect(() => {
    const filtered = orders.filter(order => 
      order.dealer_anme.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtering by dealer name
      order.order_id.toString().includes(searchTerm) // Filtering by order ID
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]); // Update filtered orders when search term changes

  const handleFilter = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget); // Open dropdown menu
  };

  const handleExportOptionClick = (option) => {
    console.log(`Exporting ${option}`); // Placeholder for actual export logic
    setAnchorEl(null); // Close dropdown menu
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close dropdown menu
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component={Paper} sx={{ p: 2, flexGrow: 1 }}>
        <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Search by Order ID or Dealer Name"
            variant="outlined"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }} // Make the input grow to fill space
          />
          <Button 
            variant="contained" 
            onClick={handleExportClick} 
            sx={{ ml: 1 }}
          >
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => handleExportOptionClick('All Orders')}>All Orders</MenuItem>
            <MenuItem onClick={() => handleExportOptionClick('Pending')}>Pending</MenuItem>
            <MenuItem onClick={() => handleExportOptionClick('Completed')}>Completed</MenuItem>
            <MenuItem onClick={() => handleExportOptionClick('Shipping')}>Shipping</MenuItem>
          </Menu>
        </Box>
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
                  onClick={() => handleRowClick(order.order_id)}
                  style={{ cursor: 'pointer' }}
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
