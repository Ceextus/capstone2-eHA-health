import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Import actual page components
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import AddEquipment from "./pages/addEquipment";
import EquipmentDetails from "./pages/equipmentDetails";
import Staff from "./pages/staff";
import AddStaff from "./pages/addStaff";
import Assignments from "./pages/assignment";

// Layout wrapper for protected pages
const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <Sidebar />
    <div className="lg:ml-64 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Inventory />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Assignments />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Inventory />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* IMPORTANT: /inventory/add MUST come before /inventory/:id */}
        <Route
          path="/inventory/add"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AddEquipment />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* IMPORTANT: /inventory/edit/:id MUST come before /inventory/:id */}
        <Route
          path="/inventory/edit/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AddEquipment />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* This should be LAST among inventory routes */}
        <Route
          path="/inventory/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <EquipmentDetails />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Staff />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/add"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AddStaff />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/edit/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AddStaff />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
