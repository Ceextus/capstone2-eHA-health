import axios from 'axios';

// Base URL for MockAPI - Replace with your actual MockAPI URL
const BASE_URL = 'https://692b2acc7615a15ff24eeb70.mockapi.io/api/staff';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Staff CRUD Functions

/**
 * Get all staff members from the database
 * @returns {Promise} Array of all staff members
 */
export const getAllStaff = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching all staff:', error);
        throw error;
    }
};

/**
 * Get a single staff member by ID
 * @param {string|number} id - Staff ID
 * @returns {Promise} Single staff object
 */
export const getStaff = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching staff with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Create new staff member
 * @param {Object} data - Staff data to create
 * @returns {Promise} Created staff object
 */
export const createStaff = async (data) => {
    try {
        const response = await api.post('/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating staff:', error);
        throw error;
    }
};

/**
 * Update existing staff member
 * @param {string|number} id - Staff ID
 * @param {Object} data - Updated staff data
 * @returns {Promise} Updated staff object
 */
export const updateStaff = async (id, data) => {
    try {
        const response = await api.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating staff with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete staff member
 * @param {string|number} id - Staff ID
 * @returns {Promise} Deleted staff object
 */
export const deleteStaff = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting staff with ID ${id}:`, error);
        throw error;
    }
};

// Export the axios instance for advanced usage
export default api;