// Este es tu servicio
import apiClient from './apiClient';

const taskService = {
  createTask: async (taskData) => {
    try {

      const response = await apiClient.post('/tasks', taskData);
      
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  getTasks: async () => {
    try {
      const response = await apiClient.get('/tasks');

      return response.data;
    } catch (error) {
      console.error('Error getting tasks:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  deleteTask: async (taskId) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);

      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  updateTask: async (taskId, taskData) => {

    console.log('taskData', taskData);
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);

      return response.data;
    } catch (error) {
      console.error('Error updating task:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  getTask: async (taskId) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}`);

      return response.data;
    } catch (error) {
      console.error('Error getting task:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  completeTask: async (taskId) => {
    try {
      const response = await apiClient.put(`/tasks/complete/${taskId}`);

      return response.data;
    } catch (error) {
      console.error('Error completing task:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default taskService;
