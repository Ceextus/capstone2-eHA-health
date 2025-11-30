import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS, get } from "../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalStaff: 0,
    totalAssignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [equipmentData, staffData, assignmentsData] = await Promise.all([
        get(API_ENDPOINTS.equipment),
        get(API_ENDPOINTS.staff),
        get(API_ENDPOINTS.assignments),
      ]);

      // Ensure data is arrays and get counts
      const equipmentArray = Array.isArray(equipmentData) ? equipmentData : [];
      const staffArray = Array.isArray(staffData) ? staffData : [];
      const assignmentsArray = Array.isArray(assignmentsData)
        ? assignmentsData
        : [];

      setStats({
        totalEquipment: equipmentArray.length,
        totalStaff: staffArray.length,
        totalAssignments: assignmentsArray.length,
      });
    } catch (err) {
      setError("Failed to load dashboard data, poor internet connection . Please try again.");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Equipment Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase mb-1">
                Total Equipment
              </p>
              <p className="text-4xl font-bold text-blue-600">
                {stats.totalEquipment}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <Link
            to="/inventory"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 inline-flex items-center"
          >
            View Inventory
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Total Staff Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase mb-1">
                Total Staff
              </p>
              <p className="text-4xl font-bold text-green-600">
                {stats.totalStaff}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <Link
            to="/staff"
            className="text-sm text-green-600 hover:text-green-800 font-medium mt-4 inline-flex items-center"
          >
            View Staff
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Total Assignments Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase mb-1">
                Total Assignments
              </p>
              <p className="text-4xl font-bold text-purple-600">
                {stats.totalAssignments}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Active equipment assignments
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/inventory/add"
            className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors group"
          >
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 mr-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Equipment</h3>
                <p className="text-xs text-gray-600">Register new item</p>
              </div>
            </div>
          </Link>

          <Link
            to="/staff/add"
            className="bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors group"
          >
            <div className="flex items-center">
              <div className="bg-green-600 rounded-lg p-2 mr-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Staff</h3>
                <p className="text-xs text-gray-600">Register new member</p>
              </div>
            </div>
          </Link>

          <Link
            to="/inventory"
            className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-colors group"
          >
            <div className="flex items-center">
              <div className="bg-orange-600 rounded-lg p-2 mr-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
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
              <div>
                <h3 className="font-semibold text-gray-900">View Inventory</h3>
                <p className="text-xs text-gray-600">Browse all equipment</p>
              </div>
            </div>
          </Link>

          <Link
            to="/staff"
            className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors group"
          >
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-lg p-2 mr-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Staff</h3>
                <p className="text-xs text-gray-600">Browse all members</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchStats}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Stats
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
