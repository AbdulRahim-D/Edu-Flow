import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation for active states if needed
import { useDispatch, useSelector } from "react-redux";
import {
  LogOut,
  LayoutDashboard,
  BookOpen,
  Users,
  UserCircle,
} from "lucide-react";
import { logout } from "../features/authSlice";
import { useLazyLogoutQuery } from "../services/userAPI";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const [logoutFn, { data, isLoading }] = useLazyLogoutQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Optional enhancement: useLocation can help dynamically color active routes
  const location = useLocation();

  const dashboardPath = user?.role === "Teacher" ? "/teacher_dashboard" : "/student_dashboard";

  return (
    <div className="w-64 h-screen bg-white flex flex-col p-6 border-r border-slate-100 font-['Poppins',sans-serif] selection:bg-blue-50">
      
      {/* 🏷️ Brand Logo Header */}
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-sm italic shadow-md shadow-blue-100">
          E
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Edu-Flow
        </h1>
      </div>

      {/* 🧭 Navigation Menu */}
      <nav className="flex flex-col gap-1.5 flex-1">
        
        {/* Dashboard Link */}
        <Link
          to={dashboardPath}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
            location.pathname === dashboardPath
              ? "bg-blue-50 text-blue-500"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard size={18} strokeWidth={2} className="transition-transform group-hover:scale-105" /> 
          <span>Dashboard</span>
        </Link>

        {/* Assignments Link */}
        <Link
          to="/assignment"
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
            location.pathname === "/assignment"
              ? "bg-blue-50 text-blue-500"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <BookOpen size={18} strokeWidth={2} className="transition-transform group-hover:scale-105" /> 
          <span>Assignments</span>
        </Link>

        {/* Classes Link */}
        <Link
          to="/classes"
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
            location.pathname === "/classes"
              ? "bg-blue-50 text-blue-500"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Users size={18} strokeWidth={2} className="transition-transform group-hover:scale-105" /> 
          <span>Classes</span>
        </Link>

        {/* Profile Link */}
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
            location.pathname === "/profile"
              ? "bg-blue-50 text-blue-500"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <UserCircle size={18} strokeWidth={2} className="transition-transform group-hover:scale-105" /> 
          <span>Profile</span>
        </Link>
      </nav>

      {/* 👤 User Card & Logout Section */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">
        
        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/40 flex items-center justify-center text-slate-600 font-semibold text-sm uppercase">
            {user?.name ? user.name.substring(0, 2) : "US"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-800 truncate leading-tight">
              {user?.name || "User"}
            </span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
              {user?.role || "Account"}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={async () => {
            try {
              let result = await logoutFn();
              navigate("/");
              dispatch(logout());
            } catch (error) {
              console.log(error);
            }
          }}
          disabled={isLoading}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50/50 hover:text-red-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          <LogOut size={18} strokeWidth={2} /> 
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}

export default Sidebar;