import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Users, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { useDeleteAssignmentMutation } from '../services/taskAPI';
import toast from 'react-hot-toast';

function AssignmentCard({ assignment, isTeacherView = false }) {
  const statusStyles = {
    "Graded": "bg-green-100 text-green-700 border-green-200",
    "Submitted": "bg-blue-100 text-blue-700 border-blue-200",
    "In-Progress": "bg-orange-100 text-orange-700 border-orange-200",
    "To-Do": "bg-slate-100 text-slate-700 border-slate-200"
  };

  const [deleteAssignment, { isLoading: isDeleting }] = useDeleteAssignmentMutation();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const assignmentData={
          title:assignment._id,
          description:assignment.description,
          }
        await deleteAssignment(assignmentData).unwrap();
        toast.success("Assignment deleted successfully! 🔥");
      } catch (err) {
        toast.error(err?.data?.message || "Delete cheyadam fail ayindi!");
      }
    }
  };


  return (
    <div className="group relative bg-white border border-slate-200 rounded-4xl p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-1">
      
      {isTeacherView && (
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
          {assignment?.subject}
        </span>

      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors pr-8">
          {assignment?.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2">
          {assignment?.description}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-slate-500 text-sm gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Due: {new Date(assignment?.deadline).toLocaleDateString()}</span>
        </div>

        {isTeacherView ? (
          <div className="flex items-center text-slate-500 text-sm gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>{assignment?.totalStudents || 0} Students Assigned</span>
          </div>
        ) : (
          <div className="flex items-center text-slate-500 text-sm gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-200 uppercase">
              {assignment?.assignedBy?.name?.charAt(0)}
            </div>
            <span>{assignment?.assignedBy?.name}</span>
          </div>
        )}
      </div>

      {!isTeacherView && assignment?.status === "Graded" && (
        <div className="mt-4 p-4 bg-green-50/50 rounded-2xl border border-green-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-green-600 uppercase">Grade Received</p>
            <p className="text-lg font-black text-green-700">{assignment?.grade}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
        </div>
      )}
    </div>
  );
}

export default AssignmentCard;