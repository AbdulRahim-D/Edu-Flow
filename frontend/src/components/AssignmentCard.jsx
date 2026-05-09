import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Users, ArrowRight, Layers } from 'lucide-react';

function AssignmentCard({ assignment }) {
  const navigate = useNavigate();

  const handleCardClick = () => {

    navigate(`/assignment/kanban/${ encodeURIComponent( assignment._id)}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <Layers className="absolute -right-4 -bottom-4 text-slate-50 w-24 h-24 group-hover:text-indigo-50 transition-colors duration-300" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <BookOpen size={24} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
              {assignment?.subject || "General"}
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <Users size={12} />
              <span className="text-[10px] font-semibold">{assignment?.totalStudents} Students</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {assignment?._id} {/* _id ikkada Grouped Title */}
          </h3>
          <p className="text-xs font-medium text-slate-400 uppercase">
            Class: <span className="text-slate-600">{assignment?.classId?.className || "N/A"}</span>
          </p>
          <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">
            {assignment?.description || "Click to monitor student progress on the board."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-xs font-medium">
              Due: {assignment?.deadline ? new Date(assignment.deadline).toLocaleDateString() : "No Date"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
            <span>View Board</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentCard;