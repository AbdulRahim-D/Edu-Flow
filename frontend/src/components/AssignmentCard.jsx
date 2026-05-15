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
          title: assignment._id,
          description: assignment.description,
          classId: assignment.classId._id
        };
        await deleteAssignment(assignmentData).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Delete failed!");
      }
    }
  };

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-[0_20px_40px_rgba(59,130,246,0.06)] hover:border-blue-500/10 transition-all duration-300 flex flex-col h-full font-['Poppins',sans-serif] text-slate-800 antialiased">
      
      <div className="flex justify-between items-center mb-5 relative z-10">
        <span className="px-3 py-1 bg-blue-50/60 text-blue-500 text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-100/30">
          {assignment?.subject || "General"}
        </span>

        {isTeacherView && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        )}
      </div>

      <div className="mb-6 relative z-10 flex-1 min-w-0">
        <h3 className="text-base font-bold text-slate-900 mb-2 transition-colors truncate group-hover:text-blue-500">
          {isTeacherView ? assignment?._id : assignment?.title}
        </h3>
        <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2">
          {assignment?.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        <div className="flex items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100/70 gap-2.5 transition-all duration-300">
          <Calendar className="w-4 h-4 text-slate-400" />
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Due Date</span>
            <span className="text-xs font-semibold text-slate-700 mt-0.5">
              {assignment?.deadline ? new Date(assignment.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "No Date"}
            </span>
          </div>
        </div>

        <div className="flex items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100/70 gap-2.5 transition-all duration-300">
          {isTeacherView ? (
            <Users className="w-4 h-4 text-slate-400" />
          ) : (
            <div className="w-5 h-5 rounded bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center border border-blue-600/10 uppercase shadow-sm">
              {assignment?.assignedBy?.name?.charAt(0) || 'T'}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              {isTeacherView ? 'Enrolled' : 'Mentor'}
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-0.5 truncate">
              {isTeacherView ? `${assignment?.totalStudents || 0} Students` : (assignment?.assignedBy?.name || "Teacher")}
            </span>
          </div>
        </div>
      </div>

      {!isTeacherView && assignment?.status === "Graded" && (
        <div className="mt-5 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300 relative z-10">
          <div className="p-4 bg-emerald-500 rounded-xl flex items-center justify-between overflow-hidden relative shadow-md shadow-emerald-100/50">
            <div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Performance</p>
              <p className="text-2xl font-bold text-white mt-0.5 leading-none">{assignment?.grade || "N/A"}</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-white/10 absolute -right-2 -bottom-2 rotate-12" strokeWidth={1.5} />
          </div>

          {assignment?.feedback && (
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl relative">
              <MessageSquareQuote className="w-3.5 h-3.5 text-blue-400 mb-1.5" />
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {assignment.feedback}
              </p>
              <div className="absolute top-3.5 right-4 opacity-40">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">REMARK</p>
              </div>
            </div>
          )}
        </div>
      )}

      {isTeacherView && (
        <div className="mt-5 flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-100/80 rounded-xl relative z-10">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Assignment</span>
        </div>
      )}
    </div>
  );
}

export default AssignmentCard;