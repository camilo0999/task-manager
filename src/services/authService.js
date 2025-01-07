import apiClient from './apiClient';

const authService = {
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error('El usuario ya está registrado');
      }
      console.error('Error registrando usuario:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  login: async (userData) => {
    try {
      const response = await apiClient.post('/auth/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { token, role, username, name, lastname, telefono, id } = response.data; 
      localStorage.setItem('id', id);
      localStorage.setItem('name', name);
      localStorage.setItem('lastname', lastname);
      localStorage.setItem('telefono', telefono);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      return response.data;
      
    } catch (error) {
      console.error('Error logueando usuario:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default authService;