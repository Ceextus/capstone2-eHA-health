import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllStaff, deleteStaff } from "../api/staff";

const Staff = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch staff on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  // Filter staff when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStaff(staff);
    } else {
      const filtered = staff.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  }, [searchTerm, staff]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getAllStaff();

      // Ensure data is an array
      const staffArray = Array.isArray(data) ? data : [];

      setStaff(staffArray);
      setFilteredStaff(staffArray);
      setError(null);
    } catch (err) {
      setError("Failed to fetch staff. Please try again later.");
      console.error("Error fetching staff:", err);

      // Set to empty arrays on error
      setStaff([]);
      setFilteredStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (memberId) => {
    navigate(`/staff/${memberId}`);
  };

  const handleEdit = (e, member) => {
    e.stopPropagation(); // Prevent row click
    setOpenMenuId(null);
    navigate(`/staff/edit/${member.id}`);
  };

  const handleDelete = async (e, member) => {
    e.stopPropagation(); // Prevent row click
    setOpenMenuId(null);

    if (
      window.confirm(
        `Are you sure you want to delete "${member.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteStaff(member.id);
        // Refresh the staff list after deletion
        await fetchStaff();
      } catch (err) {
        alert("Failed to delete staff member. Please try again.");
        console.error("Error deleting staff:", err);
      }
    }
  };

  const toggleMenu = (e, memberId) => {
    e.stopPropagation(); // Prevent row click
    setOpenMenuId(openMenuId === memberId ? null : memberId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
        <Link
          to="/staff/add"
          className="bg-[#19488a] hover:bg-[#19488a]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Staff
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, role, department, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No staff found matching your search."
                      : "No staff members available."}
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member, index) => {
                  const isLastRow = index === filteredStaff.length - 1;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {member.name?.charAt(0).toUpperCase() || "S"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.role || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.department || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div
                          className="relative"
                          ref={openMenuId === member.id ? dropdownRef : null}
                        >
                          <button
                            onClick={(e) => toggleMenu(e, member.id)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded hover:bg-gray-100"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === member.id && (
                            <div
                              className={`absolute ${
                                isLastRow ? "bottom-full mb-2" : "top-full mt-2"
                              } right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50`}
                            >
                              <div className="py-1">
                                <button
                                  onClick={(e) => handleEdit(e, member)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => handleDelete(e, member)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      {filteredStaff.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredStaff.length} of {staff.length} staff members
        </div>
      )}
    </div>
  );
};

export default Staff;
