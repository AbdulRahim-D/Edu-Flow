import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Users, 
  Trash2, 
  Loader2,
  MessageSquareQuote,
  Clock
} from 'lucide-react';
import { useDeleteAssignmentMutation } from '../services/taskAPI';
import toast from 'react-hot-toast';

function AssignmentCard({ assignment, isTeacherView = false }) {
  const [deleteAssignment, { isLoading: isDeleting }] = useDeleteAssignmentMutation();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this assignment? 🔥")) {
      try {
        const assignmentData = {
          title: assignment.title,
          description: assignment.description,
          classId: assignment.classId
        };
        await deleteAssignment(assignmentData).unwrap();
        toast.success("Assignment removed successfully!");
      } catch (err) {
        toast.error(err?.data?.message || "Delete failed!");
      }
    }
  };
  console.log(assignment);
  

  return (
    <div className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-7 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
      
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 group-hover:scale-150 transition-all duration-700" />

      <div className="flex justify-between items-center mb-6 relative z-10">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-2xl uppercase tracking-widest border border-indigo-100/50">
          {assignment?.subject || "General"}
        </span>

        {isTeacherView && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm border border-rose-100 disabled:opacity-50 active:scale-90"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        )}
      </div>

      <div className="mb-8 relative z-10 flex-1">
        <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight uppercase">
          {isTeacherView? assignment?._id:assignment?.title}
        </h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-2 italic">
          {assignment?.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="flex items-center p-4 bg-slate-50/50 rounded-[1.8rem] border border-slate-100 gap-3 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Due Date</span>
            <span className="text-xs font-black text-slate-700">
                {assignment?.deadline ? new Date(assignment.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "No Date"}
            </span>
          </div>
        </div>

        <div className="flex items-center p-4 bg-slate-50/50 rounded-[1.8rem] border border-slate-100 gap-3 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300">
           {isTeacherView ? (
             <Users className="w-5 h-5 text-indigo-500" />
           ) : (
             <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-200 uppercase">
               {assignment?.assignedBy?.name?.charAt(0) || 'T'}
             </div>
           )}
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              {isTeacherView ? 'Enrolled' : 'Mentor'}
            </span>
            <span className="text-xs font-black text-slate-700 truncate max-w-20">
                {isTeacherView ? `${assignment?.totalStudents || 0} Students` : (assignment?.assignedBy?.name || "Teacher")}
            </span>
          </div>
        </div>
      </div>

      {!isTeacherView && assignment?.status === "Graded" && (
        <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          <div className="p-5 bg-emerald-500 rounded-4xl shadow-xl shadow-emerald-100 flex items-center justify-between overflow-hidden relative group/grade">
            <div className="z-10">
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Performance</p>
              <p className="text-4xl font-black text-white leading-none mt-1">{assignment?.grade || "N/A"}</p>
            </div>
            <CheckCircle2 className="w-20 h-20 text-white/20 absolute -right-4 -bottom-4 rotate-12 group-hover/grade:scale-110 transition-transform" />
          </div>

          {assignment?.feedback && (
            <div className="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-4x1 relative backdrop-blur-sm">
                <MessageSquareQuote className="w-4 h-4 text-indigo-400 mb-2" />
                <p className="text-[11px] text-indigo-900 font-bold leading-relaxed">
                   {assignment.feedback}
                </p>
                <div className="absolute top-3 right-5 opacity-20">
                   <p className="text-[8px] font-black text-indigo-400 uppercase">REMARK</p>
                </div>
            </div>
          )}
        </div>
      )}

      {isTeacherView && (
        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 relative z-10">
           <Clock className="w-3 h-3 text-slate-400" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Active Assignment</span>
        </div>
      )}
    </div>
  );
}

export default AssignmentCard;