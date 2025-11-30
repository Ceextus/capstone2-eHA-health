import { useState, useEffect } from "react";
import { API_ENDPOINTS, get } from "../api/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [enrichedAssignments, setEnrichedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [assignmentsData, equipmentData, staffData] = await Promise.all([
        get(API_ENDPOINTS.assignments),
        get(API_ENDPOINTS.equipment),
        get(API_ENDPOINTS.staff),
      ]);

      // Ensure arrays
      const assignmentsArray = Array.isArray(assignmentsData)
        ? assignmentsData
        : [];
      const equipmentArray = Array.isArray(equipmentData) ? equipmentData : [];
      const staffArray = Array.isArray(staffData) ? staffData : [];

      setAssignments(assignmentsArray);

      // Join data manually
      const enriched = assignmentsArray.map((assignment) => {
        const equipment = equipmentArray.find(
          (e) => e.id === assignment.equipmentId
        );
        const staff = staffArray.find((s) => s.id === assignment.staffId);

        return {
          ...assignment,
          equipmentName:
            equipment?.name || assignment.equipmentName || "Unknown Equipment",
          staffName: staff?.name || assignment.staffName || "Unknown Staff",
          equipmentCategory: equipment?.category || "N/A",
        };
      });

      // Sort by assigned date (newest first)
      enriched.sort(
        (a, b) => new Date(b.assignedDate) - new Date(a.assignedDate)
      );

      setEnrichedAssignments(enriched);
    } catch (err) {
      setError("Failed to load assignments");
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "returned":
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Assignment History
          </h1>
          <p className="text-gray-600 mt-1">
            Track all equipment assignments to staff members
          </p>
        </div>
        <button
          onClick={fetchAssignments}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
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
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Assignments</p>
          <p className="text-2xl font-bold text-gray-900">
            {enrichedAssignments.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Active Assignments</p>
          <p className="text-2xl font-bold text-green-600">
            {
              enrichedAssignments.filter(
                (a) => a.status?.toLowerCase() === "active"
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Completed Assignments</p>
          <p className="text-2xl font-bold text-gray-600">
            {
              enrichedAssignments.filter(
                (a) =>
                  a.status?.toLowerCase() === "returned" ||
                  a.status?.toLowerCase() === "completed"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unassigned At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrichedAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No assignment history available.
                  </td>
                </tr>
              ) : (
                enrichedAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.equipmentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {assignment.equipmentCategory}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-xs">
                            {assignment.staffName?.charAt(0).toUpperCase() ||
                              "S"}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.staffName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(assignment.assignedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.returnDate ? (
                          formatDate(assignment.returnDate)
                        ) : (
                          <span className="text-gray-400 italic">
                            Not returned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          assignment.status
                        )}`}
                      >
                        {assignment.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {assignment.notes || "-"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      {enrichedAssignments.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {enrichedAssignments.length} assignment
          {enrichedAssignments.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default Assignments;
