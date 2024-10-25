// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.14:8000/app/loginUser/', { email, password });
      const { data } = response.data;

      console.log('API Response:', data); // Debugging line

      if (data.valid) {
        // Save user details in localStorage
        localStorage.setItem('token', data._c1);
        localStorage.setItem('user', JSON.stringify(data));

        // Debugging: Console log the user role
        console.log('User Role:', data.role_name); // Debugging line

        // Redirect based on role
        switch (data.role_name) {
          case 'super_admin':
            navigate('/dashboard/super_admin');
            break;
          case 'dealer_admin':
            navigate('/dashboard/dealer');
            break;
          case 'manufacturer_admin':
            navigate('/dashboard/manufacturer');
            break;
          default:
            alert('Role not recognized');
            navigate('/login');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Server Error');
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
