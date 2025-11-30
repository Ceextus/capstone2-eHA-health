import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllEquipment, deleteEquipment } from "../api/equipment";

const Inventory = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch equipment on component mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Filter equipment when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEquipment(equipment);
    } else {
      const filtered = equipment.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEquipment(filtered);
    }
  }, [searchTerm, equipment]);

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

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await getAllEquipment();

      // Ensure data is an array
      const equipmentArray = Array.isArray(data) ? data : [];

      setEquipment(equipmentArray);
      setFilteredEquipment(equipmentArray);
      setError(null);
    } catch (err) {
      setError("Failed to fetch equipment. Please try again later.");
      console.error("Error fetching equipment:", err);

      // Set to empty arrays on error
      setEquipment([]);
      setFilteredEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (itemId) => {
    navigate(`/inventory/${itemId}`);
  };

  const handleEdit = (e, item) => {
    e.stopPropagation(); 
    setOpenMenuId(null);
    navigate(`/inventory/edit/${item.id}`);
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation(); 
    setOpenMenuId(null);

    if (
      window.confirm(
        `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteEquipment(item.id);
       
        await fetchEquipment();
      } catch (err) {
        alert("Failed to delete equipment. Please try again.");
        console.error("Error deleting equipment:", err);
      }
    }
  };

  const toggleMenu = (e, itemId) => {
    e.stopPropagation(); // Prevent row click
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "available":
        return "bg-green-100 text-green-800";
      case "assigned":
      case "in use":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
      case "repair":
        return "bg-yellow-100 text-yellow-800";
      case "retired":
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <Link
          to="/inventory/add"
          className="bg-[#19488a] hover:bg-[#19488a]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Equipment
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, category, serial number, status, or assigned to..."
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

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No equipment found matching your search."
                      : "No equipment available."}
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item, index) => {
                  const isLastRow = index === filteredEquipment.length - 1;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.category || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.serialNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.assignedTo || "Unassigned"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div
                          className="relative"
                          ref={openMenuId === item.id ? dropdownRef : null}
                        >
                          <button
                            onClick={(e) => toggleMenu(e, item.id)}
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
                          {openMenuId === item.id && (
                            <div
                              className={`absolute ${
                                isLastRow ? "bottom-full mb-2" : "top-full mt-2"
                              } right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50`}
                            >
                              <div className="py-1">
                                <button
                                  onClick={(e) => handleEdit(e, item)}
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
                                  onClick={(e) => handleDelete(e, item)}
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
      {filteredEquipment.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredEquipment.length} of {equipment.length} equipment
        </div>
      )}
    </div>
  );
};

export default Inventory;
