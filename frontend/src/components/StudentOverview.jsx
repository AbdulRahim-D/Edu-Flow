import React, { useEffect } from 'react';
import { useGetStudentAssignmentQuery } from '../services/taskAPI';
import { Clock, AlertCircle, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

function StudentOverview() {
  //  1. Extract 'refetch' from the query
  const { data: response, isLoading, refetch } = useGetStudentAssignmentQuery();
  const navigate = useNavigate();

  //  2. Listen to Socket Events for New/Urgent Tasks sync
  useEffect(() => {
    if (!socket) return;

    const handleSyncTasks = () => {
      refetch();
    };

    socket.on("assignment_created", handleSyncTasks);
    socket.on("assignment_deleted", handleSyncTasks);
    socket.on("task_submitted", handleSyncTasks);
    socket.on("grade_updated", handleSyncTasks);

    return () => {
      socket.off("assignment_created", handleSyncTasks);
      socket.off("assignment_deleted", handleSyncTasks);
      socket.off("task_submitted", handleSyncTasks);
      socket.off("grade_updated", handleSyncTasks);
    };
  }, [socket, refetch]);

  if (isLoading) return <Loading />;

  const assignments = response?.data || [];
  const now = new Date();

  // Logic to calculate urgent tasks (Due within 48 hours and not submitted/graded)
  const urgentTasks = assignments.filter((task) => {
    if (task.status === "Graded" || task.status === "Submitted") return false;
    const deadline = new Date(task.deadline);
    const diffInHours = (deadline - now) / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= 48;
  });

  // Logic to calculate new tasks (Created within the last 24 hours)
  const newTasks = assignments.filter((task) => {
    const createdAt = new Date(task.createdAt || Date.now());
    const diffInHours = (now - createdAt) / (1000 * 60 * 60);
    return diffInHours <= 24 && task.status === "To-Do";
  });

  return (
    <div className="p-0 font-['Poppins',sans-serif] text-slate-800 antialiased selection:bg-blue-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Urgent Tasks Section */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden flex flex-col h-[420px]">
          <div className="absolute -top-6 -right-6 p-8 opacity-[0.02] rotate-12 pointer-events-none text-slate-900">
            <Clock size={120} />
          </div>

          <div className="flex items-center gap-3 mb-5 shrink-0">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-500 border border-rose-100/30">
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Urgent Tasks</h2>
              <p className="text-slate-400 text-[11px] font-medium tracking-wide mt-0.5">Ending Soon</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3">
            {urgentTasks.length > 0 ? (
              urgentTasks.map((task) => (
                <div 
                  key={task._id} 
                  onClick={() => navigate(`/class_assignment/${task.classId}`)}
                  className="group flex items-center justify-between p-4 bg-slate-50/60 border border-slate-100/80 rounded-xl hover:bg-rose-50/30 hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs font-bold text-rose-500 border border-slate-200/40 group-hover:bg-rose-500 group-hover:text-white group-hover:border-transparent transition-all text-xs flex-shrink-0">
                      {task.subject?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{task.title}</h4>
                      <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                        <Clock size={11} /> {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 font-semibold text-xs tracking-wide">No immediate deadlines.</p>
              </div>
            )}
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden flex flex-col h-[420px]">
          <div className="absolute -top-6 -right-6 p-8 opacity-[0.02] -rotate-12 pointer-events-none text-slate-900">
            <Sparkles size={120} />
          </div>

          <div className="flex items-center gap-3 mb-5 shrink-0">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-500 border border-blue-100/30">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">New Arrivals</h2>
              <p className="text-slate-400 text-[11px] font-medium tracking-wide mt-0.5">Just Assigned</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3">
            {newTasks.length > 0 ? (
              newTasks.map((task) => (
                <div 
                  key={task._id} 
                  onClick={() => navigate(`/class_assignment/${task.classId}`)}
                  className="group flex items-center justify-between p-4 bg-slate-50/60 border border-slate-100/80 rounded-xl hover:bg-blue-50/30 hover:border-blue-500/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs font-bold text-blue-500 border border-slate-200/40 group-hover:bg-blue-500 group-hover:text-white group-hover:border-transparent transition-all text-xs flex-shrink-0">
                      {task.subject?.charAt(0) || 'N'}
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-blue-500 text-[9px] font-bold uppercase bg-blue-50 border border-blue-100/40 px-1.5 py-0.5 rounded group-hover:bg-white group-hover:border-blue-200/30 transition-colors tracking-wider">New</span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={11} /> {new Date(task.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 font-semibold text-xs tracking-wide">Nothing new today.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentOverview;