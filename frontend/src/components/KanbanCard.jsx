import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { User, Link2, CheckCircle2, AlertCircle } from "lucide-react";

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
          className={`group p-5 mb-4 bg-white rounded-3xl border-2 transition-all cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ?
              "shadow-2xl ring-2 ring-indigo-500 rotate-1 scale-105 z-50"
            : isOverdue ?
              "border-red-200 shadow-sm hover:border-red-400 bg-red-50/20"
            : "border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200"
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              <span
                className={`text-[10px] font-black text-white px-2 py-0.5 rounded-lg uppercase tracking-wider ${priorityColor}`}
              >
                {task.priority}
              </span>
              {isOverdue && (
                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-lg uppercase flex items-center gap-1">
                  <AlertCircle size={10} /> LATE
                </span>
              )}
            </div>
            {task.status === "Graded" && (
              <CheckCircle2 size={16} className="text-emerald-500" />
            )}
          </div>

          <h4
            className={`font-black text-sm mb-1 leading-tight uppercase transition-colors ${isOverdue ? "text-red-800" : "text-slate-800"} group-hover:text-indigo-600`}
          >
            {task.title}
          </h4>
          <p className="text-slate-400 text-[11px] line-clamp-1 font-medium italic mb-4">
            {task.description}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p
              className={`text-[9px] font-bold uppercase ${isOverdue ? "text-red-500" : "text-slate-400"}`}
            >
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>

          {isTeacherView && (
            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                    Student
                  </p>
                  <p className="text-[11px] font-extrabold text-slate-700 leading-tight">
                    {task.assignedTo?.name || "Unknown"}
                  </p>
                </div>
              </div>
              {task.submissionLink && (
                <div
                  title="Submission Available"
                  className="p-1.5 bg-slate-50 rounded-lg text-slate-400"
                >
                  <Link2 size={14} />
                </div>
              )}
            </div>
          )}

          {!isTeacherView && task.status === "Graded" && task.grade && (
            <div className="mt-2 py-2 px-3 bg-emerald-50 rounded-xl flex items-center justify-between">
              <p className="text-[10px] font-bold text-emerald-600">GRADE</p>
              <span className="font-black text-emerald-700 text-xs">
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
