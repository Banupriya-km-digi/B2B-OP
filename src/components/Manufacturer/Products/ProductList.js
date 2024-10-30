import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, IconButton, Pagination, CircularProgress, Button, Box, MenuItem, Select, FormControl
} from '@mui/material';
import { Edit, Delete,  ImportContacts } from '@mui/icons-material';

function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('user');
        let manufactureUnitId = '';

        if (userData) {
          const data = JSON.parse(userData);
          manufactureUnitId = data.manufacture_unit_id;
        }

        // Fetch categories
        const categoryResponse = await axios.get(`http://192.168.1.14:8000/app/obtainProductCategoryList/?manufacture_unit_id=${manufactureUnitId}`);
        setCategories(categoryResponse.data.data || []);

        // Fetch products
        const productResponse = await axios.get(`http://192.168.1.14:8000/app/obtainProductsList/?manufacture_unit_id=${manufactureUnitId}`);
        setItems(productResponse.data.data || []);
      } catch (err) {
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = async (event) => {
    const selectedCategory = event.target.value;
    setFilter(selectedCategory);

    if (selectedCategory) {
      try {
        const userData = localStorage.getItem('user');
        let manufactureUnitId = '';

        if (userData) {
          const data = JSON.parse(userData);
          manufactureUnitId = data.manufacture_unit_id;
        }

        const response = await axios.get(`http://192.168.1.14:8000/app/obtainProductCategoryList/?manufacture_unit_id=${manufactureUnitId}&product_category_id=${selectedCategory}`);
        setItems(response.data.data || []);
      } catch (err) {
        setError('Failed to load filtered items');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter ? item.category === filter : true;
    return matchesSearch && matchesFilter;
  });

  const paginatedItems = filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-dashboard" style={{ margin: '2%' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>

      <Box>
  <a href="/manufacturer/products/import" target="_blank" rel="noopener noreferrer">
    <IconButton color="primary" style={{ marginLeft: '10px' }}>
      <ImportContacts />
    </IconButton>
  </a>
</Box>

      <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
          <Select
            value={filter}
            onChange={handleFilterChange}
            displayEmpty
            size="small"
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
          <Select
            value=""
            displayEmpty
            size="small"
          >
            <MenuItem disabled value="">
              <em>Bulk Actions</em>
            </MenuItem>
            <MenuItem value="edit">Edit</MenuItem>
            <MenuItem value="hide">Hide</MenuItem>
            <MenuItem value="unhide">Unhide</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ width: 200 }}
        />

  
 



      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No Data Found</TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link to={`/manufacturer/products/details/${item.id}`}>
                      <img src={item.logo} alt={item.name} style={{ width: 50, height: 'auto' }} />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/manufacturer/products/details/${item.id}`}>{item.name}</Link>
                  </TableCell>
                  <TableCell>
                    {item.description ? item.description.substring(0, 80) + '...' : 'No description available'}
                  </TableCell>
                  <TableCell>
                    <IconButton><Edit /></IconButton>
                    <IconButton><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(filteredItems.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}
        />
      </TableContainer>
    </div>
  );
}

export default ProductList;
