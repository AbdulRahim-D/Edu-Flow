import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut, LayoutDashboard, BookOpen, Users, UserCircle } from 'lucide-react'
import { logout } from '../features/authSlice'

function Sidebar() {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    return (
        <div className="w-64 h-screen border-2 text-white flex flex-col p-5">
            <h1 className="text-2xl font-bold mb-10 text-blue-400">Edu-Flow</h1>
            
            <nav className="flex flex-col gap-4 flex-1">
                {/* Dynamic Dashboard Link */}
                <Link to={user?.role === "Teacher" ? "/teacher_dashboard" : "/student_dashboard"} className="flex text-black items-center gap-3 hover:text-blue-400">
                    <LayoutDashboard size={20}/> DashBoard
                </Link>

                <Link to="/assignment" className="flex text-black items-center gap-3 hover:text-blue-400">
                    <BookOpen size={20}/> Assignments
                </Link>

                <Link to="/class" className="flex text-black items-center gap-3 hover:text-blue-400">
                    <Users size={20}/> Classes
                </Link>

                <Link to="/profile" className="flex text-black items-center gap-3 hover:text-blue-400">
                    <UserCircle size={20}/> Profile
                </Link>
            </nav>

            {/* Logout Button at Bottom */}
            <button 
                onClick={() => dispatch(logout())} 
                className="flex items-center gap-3 text-red-400 hover:text-red-500 mt-auto pt-5 border-t border-slate-700"
            >
                <LogOut size={20}/> Logout
            </button>
        </div>
    )
}

export default Sidebar