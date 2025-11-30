import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    users: false,
    equipment: false,
    operators: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.clear();
    navigate("/login");
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isActiveSection = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 p-2 rounded-md shadow-lg hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 bg-[#19488a] h-screen
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="h-16 flex items-center justify-center px-6 border-b border-slate-700 flex-shrink-0">
            <div className="text-center">
              <h1 className="text-white font-bold text-lg">
                St. Maria Gorreti
              </h1>
              <p className="text-slate-400 text-xs">Hospital Management</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {/* Dashboard */}
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActivePath("/dashboard")
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }
                  `}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Users Dropdown */}
              <li>
                <button
                  onClick={() => toggleMenu("users")}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActiveSection(["/staff"])
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
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
                    <span>Staffs</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMenus.users ? "rotate-90" : ""
                    }`}
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
                </button>
                {openMenus.users && (
                  <ul className="mt-1 ml-11 space-y-1">
                    <li>
                      <Link
                        to="/staff"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActivePath("/staff")
                              ? "bg-white text-slate-800 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-700"
                          }
                        `}
                      >
                        All Staffs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/staff/add"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActivePath("/staff/add")
                              ? "bg-white text-slate-800 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-700"
                          }
                        `}
                      >
                        Add Staff
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Equipment Dropdown */}
              <li>
                <button
                  onClick={() => toggleMenu("equipment")}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActiveSection([
                        "/inventory",
                        "/equipment",
                        "/assignments",
                      ])
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
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
                    <span>Equipment</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMenus.equipment ? "rotate-90" : ""
                    }`}
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
                </button>
                {openMenus.equipment && (
                  <ul className="mt-1 ml-11 space-y-1">
                    <li>
                      <Link
                        to="/inventory"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActivePath("/inventory")
                              ? "bg-white text-slate-800 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-700"
                          }
                        `}
                      >
                        All Equipment
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/inventory/add"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActivePath("/inventory/add")
                              ? "bg-white text-slate-800 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-700"
                          }
                        `}
                      >
                        Add Equipment
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/equipment"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActivePath("/equipment")
                              ? "bg-white text-slate-800 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-700"
                          }
                        `}
                      >
                        Management
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/assignments"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActivePath("/assignments")
                              ? "bg-white text-slate-800 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-700"
                          }
                        `}
                      >
                        Assignments
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-slate-700 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
