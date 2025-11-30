const AssignmentTable = ({
  data = [],
  onViewEquipment,
  onViewStaff,
  onReturn,
  showActions = false,
}) => {
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

  console.log(data);  

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "returned":
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
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
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={showActions ? "8" : "7"}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No assignments available
                </td>
              </tr>
              
            ) : (
              data.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.equipmentName || "Unknown Equipment"}
                      {onViewEquipment && (
                        <button
                          onClick={() => onViewEquipment(assignment)}
                          className="ml-2 text-blue-600 hover:text-blue-900 text-xs"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {assignment.equipmentCategory || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-xs">
                          {assignment.staffName?.charAt(0).toUpperCase() || "S"}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.staffName || "Unknown Staff"}
                        {onViewStaff && (
                          <button
                            onClick={() => onViewStaff(assignment)}
                            className="ml-2 text-blue-600 hover:text-blue-900 text-xs"
                          >
                            →
                          </button>
                        )}
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
                    <div
                      className="text-sm text-gray-600 max-w-xs truncate"
                      title={assignment.notes}
                    >
                      {assignment.notes || "-"}
                    </div>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {onReturn &&
                        assignment.status?.toLowerCase() === "active" && (
                          <button
                            onClick={() => onReturn(assignment)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Mark Returned
                          </button>
                        )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentTable;
