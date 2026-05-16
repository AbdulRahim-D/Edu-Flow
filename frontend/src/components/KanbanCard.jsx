import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { User, Link2, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

const KanbanCard = ({ task, index, isTeacherView = false }) => {
  const priorityColor =
    task.priority === "High" ? "bg-rose-500" : "bg-blue-500";

  const isOverdue =
    new Date() > new Date(task.deadline) &&
    task.status !== "Graded" &&
    task.status !== "Submitted";

  return (
    <Draggable draggableId={task._id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group p-5 bg-white rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ?
              "shadow-[0_20px_40px_rgba(0,0,0,0.08)] border-blue-500 ring-4 ring-blue-50 rotate-1 scale-[1.02] z-50"
            : isOverdue ?
              "border-red-200 shadow-[0_4px_12px_rgba(239,68,68,0.02)] hover:border-red-400 bg-red-50/10"
            : "border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:border-blue-500/20"
          }`}
        >
          <div className="flex justify-between items-center mb-3.5">
            <div className="flex gap-1.5">
              <span
                className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-md uppercase tracking-wider ${priorityColor}`}
              >
                {task.priority}
              </span>
              {isOverdue && (
                <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md uppercase flex items-center gap-1 border border-rose-200/50">
                  <AlertCircle size={11} /> LATE
                </span>
              )}
            </div>
            {task.status === "Graded" && (
              <CheckCircle2 size={16} className="text-emerald-500" strokeWidth={2.5} />
            )}
          </div>

          <h4
            className={`font-semibold text-sm mb-1.5 transition-colors ${isOverdue ? "text-red-900" : "text-slate-800"} group-hover:text-blue-500`}
          >
            {task.title}
          </h4>
          <p className="text-slate-400 text-xs line-clamp-2 font-medium mb-4 leading-relaxed">
            {task.description}
          </p>

          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={12} className={isOverdue ? "text-rose-400" : "text-slate-300"} />
            <p
              className={`text-[10px] font-bold uppercase tracking-wider ${isOverdue ? "text-rose-500" : "text-slate-400"}`}
            >
              Due: {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>

          {isTeacherView && (
            <div className="pt-3.5 border-t border-slate-100 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100/30 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <User size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Student
                  </p>
                  <p className="text-xs font-semibold text-slate-700 leading-tight mt-0.5 truncate">
                    {task.assignedTo?.name || "Unknown"}
                  </p>
                </div>
              </div>
              {task.submissionLink && (
                <div
                  title="Submission Available"
                  className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <Link2 size={13} />
                </div>
              )}
            </div>
          )}

          {!isTeacherView && task.status === "Graded" && task.grade && (
            <div className="mt-4 py-2.5 px-3 bg-emerald-50/60 border border-emerald-100/50 rounded-xl flex items-center justify-between shadow-sm shadow-emerald-50/20">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Mark Assigned</p>
              <span className="font-bold text-emerald-600 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-emerald-100 shadow-sm">
                {task.grade}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;