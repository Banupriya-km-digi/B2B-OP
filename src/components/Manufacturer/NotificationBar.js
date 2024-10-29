// src/components/Manufacturer/NotificationBar.js

import React from 'react';
import { Box, Typography } from '@mui/material';

const NotificationBar = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#1976d2', // Change to your preferred color
      color: 'white',
      padding: '10px 20px',
      position: 'relative',
      zIndex: 1000, // Make sure it sits above other content
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>

      <Typography variant="h6">B2B-OP Manufacturer</Typography>  
      <Typography variant="h6">Notifications</Typography>
     
    </Box>
  );
};

export default NotificationBar;
