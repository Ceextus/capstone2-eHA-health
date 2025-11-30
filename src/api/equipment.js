import axios from 'axios';

// Base URL for MockAPI - Replace with your actual MockAPI URL
const BASE_URL = 'https://692aadbb7615a15ff24d55f2.mockapi.io/api/equipment';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Equipment CRUD Functions

/**
 * Get all equipment from the database
 * @returns {Promise} Array of all equipment
 */
export const getAllEquipment = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching all equipment:', error);
        throw error;
    }
};

/**
 * Get a single equipment by ID
 * @param {string|number} id - Equipment ID
 * @returns {Promise} Single equipment object
 */
export const getEquipment = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment with ID ${id}:`, error);
        throw error;
    }
};


/**
 * Create new equipment
 * @param {Object} data - Equipment data to create
 * @returns {Promise} Created equipment object
 */
export const createEquipment = async (data) => {
    try {
        const response = await api.post('/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating equipment:', error);
        throw error;
    }
};

/**
 * Update existing equipment
 * @param {string|number} id - Equipment ID
 * @param {Object} data - Updated equipment data
 * @returns {Promise} Updated equipment object
 */
export const updateEquipment = async (id, data) => {
    try {
        const response = await api.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating equipment with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete equipment
 * @param {string|number} id - Equipment ID
 * @returns {Promise} Deleted equipment object
 */
export const deleteEquipment = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting equipment with ID ${id}:`, error);
        throw error;
    }
};

// Export the axios instance for advanced usage
export default api;