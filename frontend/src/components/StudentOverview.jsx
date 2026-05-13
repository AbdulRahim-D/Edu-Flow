import React from 'react';
import { useGetStudentAssignmentQuery } from '../services/taskAPI';
import { Clock, AlertCircle, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

function StudentOverview() {
  const { data: response, isLoading } = useGetStudentAssignmentQuery();
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  const assignments = response?.data || [];
  const now = new Date();

  const urgentTasks = assignments.filter((task) => {
    if (task.status === "Graded" || task.status === "Submitted") return false;
    const deadline = new Date(task.deadline);
    const diffInHours = (deadline - now) / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= 48;
  });

  const newTasks = assignments.filter((task) => {
    const createdAt = new Date(task.createdAt || Date.now());
    const diffInHours = (now - createdAt) / (1000 * 60 * 60);
    return diffInHours <= 24 && task.status === "To-Do";
  });

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm relative overflow-hidden flex flex-col h-125">
          <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] rotate-12 pointer-events-none">
            <Clock size={120} />
          </div>

          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="p-3 bg-rose-50 rounded-2xl">
              <AlertCircle className="text-rose-500" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Urgent Tasks</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Ending Soon</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {urgentTasks.length > 0 ? (
              urgentTasks.map((task) => (
                <div 
                  key={task._id} 
                  onClick={() => navigate(`/class_assignment/${task.classId}`)}
                  className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[1.8rem] hover:bg-rose-50 hover:border-rose-100 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm font-black text-rose-500 border border-rose-50 group-hover:bg-rose-500 group-hover:text-white transition-colors text-xs">
                      {task.subject?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 uppercase text-[13px] line-clamp-1">{task.title}</h4>
                      <p className="text-rose-500 text-[9px] font-black uppercase flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-50 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400 font-bold text-[10px] uppercase italic text-center px-4">No immediate deadlines. ☕</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm relative overflow-hidden flex flex-col h-125">
          <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] -rotate-12 pointer-events-none">
            <Sparkles size={120} />
          </div>

          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Sparkles className="text-indigo-500" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">New Arrivals</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Just Assigned</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {newTasks.length > 0 ? (
              newTasks.map((task) => (
                <div 
                  key={task._id} 
                  onClick={() => navigate(`/class_assignment/${task.classId}`)}
                  className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[1.8rem] hover:bg-indigo-50 hover:border-indigo-100 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm font-black text-indigo-500 border border-indigo-50 group-hover:bg-indigo-500 group-hover:text-white transition-colors text-xs">
                      {task.subject?.charAt(0) || 'N'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 uppercase text-[13px] line-clamp-1">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-indigo-500 text-[8px] font-black uppercase bg-indigo-50 px-1.5 rounded group-hover:bg-white transition-colors">New</span>
                        <p className="text-slate-400 text-[9px] font-bold flex items-center gap-1">
                          <Calendar size={10} /> {new Date(task.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400 font-bold text-[10px] uppercase italic text-center px-4">Nothing new today.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentOverview;