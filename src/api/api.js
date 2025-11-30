import axios from 'axios';

// MockAPI Endpoints
export const API_ENDPOINTS = {
    auth: 'https://692aadbb7615a15ff24d55f2.mockapi.io/api/auth',
    equipment: 'https://692aadbb7615a15ff24d55f2.mockapi.io/api/equipment',
    staff: 'https://692b2acc7615a15ff24eeb70.mockapi.io/api/staff',
    assignments: 'https://692b2acc7615a15ff24eeb70.mockapi.io/api/assignments'
};

// Create axios instance with default configuration
const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Helper function for GET requests
export const get = async (endpoint, params = {}) => {
    try {
        const response = await api.get(endpoint, {
            params
        });
        return response.data;
    } catch (error) {
        console.error(`GET request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Helper function for POST requests
export const post = async (endpoint, data = {}) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`POST request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Helper function for PUT requests
export const put = async (endpoint, data = {}) => {
    try {
        const response = await api.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`PUT request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Helper function for DELETE requests
export const del = async (endpoint) => {
    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error(`DELETE request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Export the axios instance for advanced usage
export default api;