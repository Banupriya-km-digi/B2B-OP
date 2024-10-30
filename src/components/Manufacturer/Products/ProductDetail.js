import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditMode = new URLSearchParams(location.search).get('edit') === 'true';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://192.168.1.14:8000/app/obtainProductDetails/?project_id=${id}`);
        setProduct(response.data.data || {});
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleCancel = () => {
    navigate('/manufacturer/products');
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <Paper sx={{ padding: 4, maxWidth: 1200, margin: 'auto', mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button variant="outlined" onClick={handleCancel}>Back</Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={1}>
            {product?.product_image_list?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index}`}
                style={{ width: '60px', height: '80px', cursor: 'pointer', marginBottom: '10px' }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia component="img" height="300" image={product?.logo} alt={product?.name} />
            <CardContent>
              <Typography variant="h5" gutterBottom>{product?.name}</Typography>
              <Typography variant="body1" color="text.primary" gutterBottom>
                {product?.currency}{product?.price}
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>Add to Cart</Button>
              <Button variant="contained" color="secondary" sx={{ mt: 2, width: '100%' }}>Buy Now</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6">Product Details</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>{product?.description}</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">SKU: {product?.sku_number_product_code_item_number}</Typography>
            <Typography variant="subtitle1">Model: {product?.model}</Typography>
            <Typography variant="subtitle1">MPN: {product?.mpn}</Typography>
            <Typography variant="subtitle1">Discount: {product?.discount}</Typography>
            <Typography variant="subtitle1">UPC/EAN: {product?.upc_ean}</Typography>
            <Typography variant="subtitle1">
              Availability: {product?.availability ? 'In Stock' : 'Out of Stock'}
            </Typography>
            <Typography variant="subtitle1">Stock Quantity: {product?.quantity}</Typography>
            <Typography variant="subtitle1">Colour: {product?.attributes?.Color}</Typography>
            <Typography variant="subtitle1">Weight: {product?.attributes?.Weight}</Typography>
            <Typography variant="subtitle1">Size: {product?.attributes?.Size}</Typography>
          </Box>

          {isEditMode && (
            <Box mt={2}>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>Save</Button>
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProductDetail;
