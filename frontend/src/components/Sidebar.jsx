import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../services/api";

import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true"
  );

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  // Get user data from query
  const { data: userData } = useQuery({
    queryKey: ["auth"],
    queryFn: authAPI.getProfile,
  });

  const user = userData?.data?.user;

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/products", label: "Products", icon: Package },
    { path: "/dashboard/customers", label: "Customers", icon: Users },
    { path: "/dashboard/invoices", label: "Invoices", icon: FileText },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  if (user?.role === "admin") {
    menuItems.push({
      path: "/dashboard/admin/logs",
      label: "System Logs",
      icon: ClipboardList,
    });
  }

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        key={item.path}
        to={item.path}
        title={collapsed ? item.label : undefined}
        className={`group relative flex items-center py-3 rounded-lg transition-colors ${
          collapsed ? "justify-center px-0" : "gap-3 px-4"
        } ${
          isActive
            ? "bg-blue-950 text-blue-600"
            : "text-gray-300 hover:bg-gray-800"
        }`}
      >
        <Icon
          size={20}
          className={`shrink-0 ${isActive ? "text-blue-600" : "text-gray-500"}`}
        />

        {!collapsed && <span className="font-medium">{item.label}</span>}

        {!collapsed && isActive && (
          <ChevronRight size={16} className="ml-auto text-blue-600" />
        )}

        {collapsed && (
          <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-sm font-medium text-gray-100 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } relative z-20 shrink-0 bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`h-16 flex items-center border-b border-gray-800 ${
          collapsed ? "justify-center px-2" : "px-6"
        }`}
      >
        {collapsed ? (
          <img src="/logo.png" alt="My Invoice" className="h-9 w-9" />
        ) : (
          <img
            src="/logo-with-text.png"
            alt="My Invoice"
            className="h-8 w-auto"
          />
        )}
      </div>

      <nav className="p-4 space-y-1">{menuItems.map(renderNavItem)}</nav>

      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-1/2 right-0 z-30 flex h-7 w-7 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-gray-300 shadow-md transition-colors hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

export default Sidebar;
