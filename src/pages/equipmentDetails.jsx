import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEquipment, updateEquipment } from "../api/equipment";
import { getAllStaff } from "../api/staff";
import { logAssignment, getAssignmentHistory } from "../api/assignment";

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [staff, setStaff] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const equipmentData = await getEquipment(id);

      // Fetch staff and assignment history in parallel
      const [staffData, historyData] = await Promise.all([
        getAllStaff(),
        getAssignmentHistory(String(equipmentData.id)).catch(() => []), // Return empty array on error
      ]);

      setEquipment(equipmentData);
      setStaff(staffData);
      setAssignmentHistory(Array.isArray(historyData) ? historyData : []);
      setError(null);
    } catch (err) {
      setError("Failed to load equipment details");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedStaffId) {
      alert("Please select a staff member");
      return;
    }

    try {
      setActionLoading(true);
      setSuccessMessage("");

      const selectedStaff = staff.find((s) => s.id === selectedStaffId);

      // Create assignment record
      const assignmentData = {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        staffId: selectedStaffId,
        staffName: selectedStaff.name,
        assignedDate: new Date().toISOString(),
        status: "Active",
        notes: "Equipment assigned",
      };

      await logAssignment(assignmentData);

      // Update equipment history
      const historyEntry = {
        action: "Assigned",
        staffName: selectedStaff.name,
        date: new Date().toISOString(),
        notes: `Assigned to ${selectedStaff.name}`,
      };

      const updatedHistory = [...(equipment.history || []), historyEntry];

      // Update equipment
      const updatedEquipment = {
        ...equipment,
        status: "Assigned",
        assignedTo: selectedStaff.name,
        history: updatedHistory,
      };

      await updateEquipment(id, updatedEquipment);

      setEquipment(updatedEquipment);
      setSelectedStaffId("");
      setSuccessMessage(
        `Equipment successfully assigned to ${selectedStaff.name}`
      );

      // Refresh assignment history
      const historyData = await getAssignmentHistory(id).catch(() => []);
      setAssignmentHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      alert("Failed to assign equipment. Please try again.");
      console.error("Error assigning equipment:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!equipment.assignedTo) {
      alert("Equipment is not currently assigned");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to unassign this equipment from ${equipment.assignedTo}?`
    );
    if (!confirmed) return;

    try {
      setActionLoading(true);
      setSuccessMessage("");

      // Update equipment history
      const historyEntry = {
        action: "Unassigned",
        staffName: equipment.assignedTo,
        date: new Date().toISOString(),
        notes: `Unassigned from ${equipment.assignedTo}`,
      };

      const updatedHistory = [...(equipment.history || []), historyEntry];

      // Update equipment
      const updatedEquipment = {
        ...equipment,
        status: "Available",
        assignedTo: "",
        history: updatedHistory,
      };

      await updateEquipment(id, updatedEquipment);

      setEquipment(updatedEquipment);
      setSuccessMessage(
        "Equipment successfully unassigned and is now available"
      );

      // Refresh assignment history
      const historyData = await getAssignmentHistory(id).catch(() => []);
      setAssignmentHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      alert("Failed to unassign equipment. Please try again.");
      console.error("Error unassigning equipment:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || "Equipment not found"}
        <Link
          to="/inventory"
          className="ml-4 text-blue-600 hover:text-blue-800"
        >
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div>
     
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Equipment Details</h1>
        <Link
          to="/inventory"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Inventory
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {/* Equipment Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Equipment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium text-gray-900">
              {equipment.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="text-lg font-medium text-gray-900">
              {equipment.category}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Serial Number</p>
            <p className="text-lg font-medium text-gray-900">
              {equipment.serialNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                equipment.status
              )}`}
            >
              {equipment.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Currently Assigned To</p>
            <p className="text-lg font-medium text-gray-900">
              {equipment.assignedTo || "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-lg font-medium text-gray-900">
              {formatDate(equipment.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Assignment Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Assignment Management
        </h2>

        {equipment.assignedTo ? (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                This equipment is currently assigned to{" "}
                <span className="font-semibold">{equipment.assignedTo}</span>
              </p>
            </div>
            <button
              onClick={handleUnassign}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Unassign"}
            </button>
          </div>
        ) : (
          <div className="flex max-md:flex-col max-md:items-start items-center gap-4">
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={actionLoading}
            >
              <option value="">Select staff member</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role || "Staff"}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={actionLoading || !selectedStaffId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Assign"}
            </button>
          </div>
        )}
      </div>

      {/* Assignment History */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Assignment History
        </h2>
        {assignmentHistory.length === 0 ? (
          <p className="text-gray-500">No assignment history available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Staff Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignmentHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.staffName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.assignedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.returnDate
                        ? formatDate(record.returnDate)
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          record.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.notes || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Equipment History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Equipment History
        </h2>
        {!equipment.history || equipment.history.length === 0 ? (
          <p className="text-gray-500">No history available</p>
        ) : (
          <div className="space-y-3">
            {equipment.history.map((entry, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {entry.action}
                    </p>
                    <p className="text-sm text-gray-600">{entry.notes}</p>
                    {entry.staffName && (
                      <p className="text-sm text-gray-500">
                        Staff: {entry.staffName}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(entry.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetails;
