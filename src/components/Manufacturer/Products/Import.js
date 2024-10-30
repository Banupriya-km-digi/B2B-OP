import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Import() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationData, setValidationData] = useState(null);
  const [xlData, setXlData] = useState(null); // State to hold xl_data

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileName = selectedFile.name;

      if (
        fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        fileType !== 'application/vnd.ms-excel' &&
        !fileName.endsWith('.xls') &&
        !fileName.endsWith('.xlsx')
      ) {
        setError('Please select a valid Excel file (.xls or .xlsx)');
        setFile(null);
      } else {
        setError('');
        setFile(selectedFile);
      }
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError('');
    setValidationMessage('');
    setCanSubmit(false);
    setXlData(null); // Clear xlData on cancel
    navigate('/manufacturer/products');
  };

  const handleSubmit = async () => {
    if (xlData) { // Check if xlData is set
      const userData = localStorage.getItem('user');
      let manufactureUnitId = '';

      if (userData) {
         const data = JSON.parse(userData);
         manufactureUnitId = data.manufacture_unit_id;
      }

      try {
        const response = await axios.post(
          `http://192.168.1.14:8000/app/save_file/`,
          { xl_data: xlData, manufacture_unit_id: manufactureUnitId } // Send xlData and manufactureUnitId
        );

        if (response.data.status) {
          console.log('File submitted successfully:', response.data);
          navigate('/manufacturer/products'); // Optionally navigate after success
        } else {
          console.log('Failed to submit file:', response.data.message);
        }
      } catch (err) {
        console.error('Error submitting file:', err.message);
      }
    } else {
      console.log('No xl_data available for submission.');
    }
  };

  const handleValidate = async () => {
    if (file) {
      setLoading(true);
      setValidationMessage('');
      setCanSubmit(false);
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
          `http://192.168.1.14:8000/app/upload_file/`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (response.data.status) {
          const { xl_contains_error, validation_error, xl_data } = response.data.data; // Extract xl_data here

          if (xl_contains_error) {
            setValidationMessage('File contains errors. Please correct and revalidate.');
            setCanSubmit(false);
            setValidationData(response.data.data);
          } else {
            setValidationMessage('File is valid and ready for submission.');
            setCanSubmit(true);
            setXlData(xl_data); // Store xl_data for submission
          }
        } else {
          setValidationMessage('Validation failed: ' + response.data.message);
        }
      } catch (err) {
        setError('Failed to validate the file: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No file to validate.");
    }
  };

  useEffect(() => {
    if (validationData) {
      navigate('/manufacturer/products/validate', { state: { validationData } });
    }
  }, [validationData, navigate]);

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Import File
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box display="flex" alignItems="center" gap={2} mb={3}>
      <Button
  variant="outlined"
  component="label"
  startIcon={<CloudUploadIcon />}
  sx={{
    padding: '5px 10px',      // Smaller padding
    fontSize: '0.875rem',     // Smaller font size
    maxWidth: '200px'         // Limits the button width
  }}
>
  <input
    type="file"
    hidden
    onChange={handleFileChange}
  />
</Button>

        
        <TextField
          variant="outlined"
          disabled
          fullWidth
          placeholder="No file selected"
          value={file ? file.name : ''}
          sx={{ flexGrow: 1 }}
        />
        
        {file && (
          <IconButton color="error" onClick={handleCancel}>
            <CancelIcon />
          </IconButton>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {validationMessage && (
        <Alert severity={canSubmit ? "success" : "error"} sx={{ mb: 2 }}>
          <AlertTitle>{canSubmit ? "Success" : "Error"}</AlertTitle>
          {validationMessage}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" mt={3}>
        {!canSubmit && (
          <Button variant="outlined" color="warning" onClick={handleValidate} disabled={loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Validate'
            )}
          </Button>
        )}
        {canSubmit && (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}

export default Import;