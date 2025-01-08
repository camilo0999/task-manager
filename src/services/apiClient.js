// apiClient.js
import axios from 'axios';

const API_BASE_URL = 'https://task-manager-api-uzzf.onrender.com/api';
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

