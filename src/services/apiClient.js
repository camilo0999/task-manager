// apiClient.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json',
  }
});

console.log(apiClient.defaults.headers);

export default apiClient;

