import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [logoutFn,{data,isLoading}]=useLazyLogoutQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen  text-white bg-white flex flex-col p-5">
      
      <h1 className="text-2xl font-bold mb-5 text-blue-500">Edu-Flow</h1>
      <p className="text-black mb-4 font-semibold text-sm ">
        Welcome back! {user.name}
      </p>
      <nav className="flex flex-col gap-4 flex-1">
        <Link
          to={
            user?.role === "Teacher"
              ? "/teacher_dashboard"
              : "/student_dashboard"
          }
          className="flex text-black items-center gap-3 hover:text-blue-400"
        >
          <LayoutDashboard size={20} /> DashBoard
        </Link>

        <Link
          to="/assignment"
          className="flex text-black items-center gap-3 hover:text-blue-400"
        >
          <BookOpen size={20} /> Assignments
        </Link>

        <Link
          to="/classes"
          className="flex text-black items-center gap-3 hover:text-blue-400"
        >
          <Users size={20} /> Classes
        </Link>

        <Link
          to="/profile"
          className="flex text-black items-center gap-3 hover:text-blue-400"
        >
          <UserCircle size={20} /> Profile
        </Link>
      </nav>

      <button
        onClick={async() => {
          try{
            let result=await logoutFn();
            navigate("/");
            dispatch(logout());
          }catch(error){
            console.log(error);
          }
        }}
        className="flex items-center gap-3 text-red-400 hover:text-red-500 mt-auto pt-5 border-t border-slate-700"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
