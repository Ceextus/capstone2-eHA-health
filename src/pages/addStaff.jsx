import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createStaff, getStaff, updateStaff } from "../api/staff";

const AddStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL if editing
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch staff data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchStaffData();
    }
  }, [id]);

  const fetchStaffData = async () => {
    try {
      setFetchLoading(true);
      const staff = await getStaff(id);
      setFormData({
        name: staff.name || "",
        role: staff.role || "",
        department: staff.department || "",
        email: staff.email || "",
        phone: staff.phone || "",
      });
    } catch (error) {
      console.error("Error fetching staff:", error);
      setSubmitError("Failed to load staff data. Please try again.");
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
      newErrors.name = "Name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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
        // Update existing staff
        const staffData = {
          name: formData.name.trim(),
          role: formData.role.trim(),
          department: formData.department.trim(),
          email: formData.email.trim() || "",
          phone: formData.phone.trim() || "",
        };

        await updateStaff(id, staffData);
      } else {
        // Create new staff
        const staffData = {
          name: formData.name.trim(),
          role: formData.role.trim(),
          department: formData.department.trim(),
          email: formData.email.trim() || "",
          phone: formData.phone.trim() || "",
          createdAt: new Date().toISOString(),
        };

        await createStaff(staffData);
      }

      // Redirect to staff page on success
      navigate("/staff");
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} staff:`,
        error
      );
      setSubmitError(
        `Failed to ${
          isEditMode ? "update" : "add"
        } staff member. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/staff");
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
        {isEditMode ? "Edit Staff" : "Add Staff"}
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
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
              placeholder="e.g., Dr. Sarah Johnson"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a role</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Surgeon">Surgeon</option>
              <option value="Technician">Technician</option>
              <option value="Radiologist">Radiologist</option>
              <option value="Anesthesiologist">Anesthesiologist</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Administrative Staff">Administrative Staff</option>
              <option value="Other">Other</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department *
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.department ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a department</option>
              <option value="Emergency">Emergency</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Radiology">Radiology</option>
              <option value="Surgery">Surgery</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="ICU">ICU</option>
              <option value="Administration">Administration</option>
              <option value="Other">Other</option>
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., sarah.j@hospital.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 555-0123"
            />
          </div>

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
                ? "Update Staff"
                : "Add Staff"}
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

export default AddStaff;
