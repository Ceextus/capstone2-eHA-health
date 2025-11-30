import axios from 'axios';

// Base URL for MockAPI - Replace with your actual MockAPI URL
const BASE_URL = 'https://692b2acc7615a15ff24eeb70.mockapi.io/api/assignments';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Assignment Functions

/**
 * Log a new equipment assignment
 * @param {Object} data - Assignment data
 * @param {string|number} data.equipmentId - ID of the equipment being assigned
 * @param {string|number} data.staffId - ID of the staff member receiving equipment
 * @param {string} data.staffName - Name of the staff member
 * @param {string} data.equipmentName - Name of the equipment
 * @param {string} data.assignedDate - Date of assignment
 * @param {string} data.returnDate - Expected or actual return date (optional)
 * @param {string} data.status - Assignment status (e.g., 'Active', 'Returned')
 * @param {string} data.notes - Additional notes (optional)
 * @returns {Promise} Created assignment object
 */
export const logAssignment = async (data) => {
    try {
        const assignmentData = {
            ...data,
            assignedDate: data.assignedDate || new Date().toISOString(),
            status: data.status || 'Active',
            createdAt: new Date().toISOString()
        };

        const response = await api.post('/', assignmentData);
        return response.data;
    } catch (error) {
        console.error('Error logging assignment:', error);
        throw error;
    }
};

/**
 * Get assignment history for a specific equipment
 * @param {string|number} equipmentId - Equipment ID
 * @returns {Promise} Array of assignments for the equipment
 */
export const getAssignmentHistory = async (equipmentId) => {
    try {
        // MockAPI supports filtering with query parameters
        const response = await api.get('/', {
            params: {
                equipmentId: equipmentId
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching assignment history for equipment ${equipmentId}:`, error);
        throw error;
    }
};

/**
 * Get all assignments
 * @returns {Promise} Array of all assignments
 */
export const getAllAssignments = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching all assignments:', error);
        throw error;
    }
};

/**
 * Get assignments for a specific staff member
 * @param {string|number} staffId - Staff ID
 * @returns {Promise} Array of assignments for the staff member
 */
export const getStaffAssignments = async (staffId) => {
    try {
        const response = await api.get('/', {
            params: {
                staffId: staffId
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching assignments for staff ${staffId}:`, error);
        throw error;
    }
};

/**
 * Update an assignment (e.g., mark as returned)
 * @param {string|number} id - Assignment ID
 * @param {Object} data - Updated assignment data
 * @returns {Promise} Updated assignment object
 */
export const updateAssignment = async (id, data) => {
    try {
        const response = await api.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating assignment with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete an assignment record
 * @param {string|number} id - Assignment ID
 * @returns {Promise} Deleted assignment object
 */
export const deleteAssignment = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting assignment with ID ${id}:`, error);
        throw error;
    }
};

// Export the axios instance for advanced usage
export default api;