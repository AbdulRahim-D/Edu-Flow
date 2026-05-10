import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

function AssignmentCard({ assignment, isTeacherView = false }) {
  const statusStyles = {
    "Graded": "bg-green-100 text-green-700 border-green-200",
    "Submitted": "bg-blue-100 text-blue-700 border-blue-200",
    "In-Progress": "bg-orange-100 text-orange-700 border-orange-200",
    "To-Do": "bg-slate-100 text-slate-700 border-slate-200"
  };

  const currentStatus = assignment?.status || (isTeacherView ? "Active" : "To-Do");

  return (
    <div className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-1">
      
      <div className="flex justify-between items-start mb-4">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
          {assignment?.subject}
        </span>
        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${statusStyles[currentStatus] || "bg-slate-50"}`}>
          {currentStatus}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {assignment?.title || assignment?._id}
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
            <span>{assignment?.totalStudents} Students Assigned</span>
          </div>
        ) : (
          <div className="flex items-center text-slate-500 text-sm gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-200">
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