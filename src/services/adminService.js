import apiClient from './apiClient'; 

const adminService = {

    
    getData: async () => {
        try {
            const id = localStorage.getItem('id');
            const response = await apiClient.get('/admin/data/'+id);
            return response.data;
        } catch (error) {
            console.error('Error getting tasks:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getUsers: async () => {
        try {
            const id = localStorage.getItem('id');
            const response = await apiClient.get('/admin/users/'+id);
            return response.data;
        } catch (error) {
            console.error('Error getting tasks:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    blockUser: async (userId) => {

        try {
            console.log(userId);
            const response = await apiClient.put('/admin/block/'+localStorage.getItem('id')+'/'+userId);
            return response.data;
        } catch (error) {
            console.error('Error getting tasks:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    unblockUser: async (userId) => {
        try {
            const response = await apiClient.put('/admin/unblock/'+localStorage.getItem('id')+'/'+userId);
            return response.data;
        } catch (error) {
            console.error('Error getting tasks:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getTasks: async () => {
        try {
            const id = localStorage.getItem('id');
            const response = await apiClient.get('/admin/tasks/'+id);
            return response.data;
        } catch (error) {
            console.error('Error getting tasks:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
};

export default adminService;