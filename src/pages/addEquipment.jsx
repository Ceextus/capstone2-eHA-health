import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEquipment,
  getEquipment,
  updateEquipment,
} from "../api/equipment";

const AddEquipment = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL if editing
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    serialNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch equipment data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchEquipmentData();
    }
  }, [id]);

  const fetchEquipmentData = async () => {
    try {
      setFetchLoading(true);
      const equipment = await getEquipment(id);
      setFormData({
        name: equipment.name || "",
        category: equipment.category || "",
        serialNumber: equipment.serialNumber || "",
      });
    } catch (error) {
      console.error("Error fetching equipment:", error);
      setSubmitError("Failed to load equipment data. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Equipment name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // Update existing equipment
        const equipmentData = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          serialNumber: formData.serialNumber.trim(),
        };

        await updateEquipment(id, equipmentData);
      } else {
        // Create new equipment with default values
        const equipmentData = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          serialNumber: formData.serialNumber.trim(),
          status: "Available",
          assignedTo: "",
          history: [],
          createdAt: new Date().toISOString(),
        };

        await createEquipment(equipmentData);
      }

      // Redirect to inventory page on success
      navigate("/inventory");
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} equipment:`,
        error
      );
      setSubmitError(
        `Failed to ${
          isEditMode ? "update" : "add"
        } equipment. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/inventory");
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? "Edit Equipment" : "Add Equipment"}
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Equipment Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., X-Ray Machine"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Surgical">Surgical</option>
              <option value="Life Support">Life Support</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Therapeutic">Therapeutic</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label
              htmlFor="serialNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Serial Number *
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.serialNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., SN-12345-XR"
            />
            {errors.serialNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.serialNumber}</p>
            )}
          </div>

          {/* Default Values Info - Only show when adding new equipment */}
          {!isEditMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Default Values
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Status: Available</li>
                <li>• Assignment: Unassigned</li>
                <li>• History: Empty</li>
              </ul>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-[#19488a] text-white py-2 px-4 rounded-lg font-medium transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#19488a]/90"
              }`}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Equipment"
                : "Add Equipment"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;
