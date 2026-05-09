import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const KanbanCard = ({ task, index }) => {
  const priorityColor = task.priority === 'High' ? 'bg-rose-500' : 'bg-blue-500';

  return (
    <Draggable draggableId={task._id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group p-5 mb-4 bg-white rounded-3xl border border-slate-100 transition-all cursor-grab active:cursor-grabbing ${
            snapshot.isDragging 
              ? 'shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50' 
              : 'shadow-sm hover:shadow-md hover:border-indigo-200'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-md uppercase tracking-widest ${priorityColor}`}>
              {task.priority}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-300"></div>
          </div>
          
          <h4 className="font-extrabold text-slate-800 text-sm mb-1 leading-tight uppercase group-hover:text-indigo-600 transition-colors">
            {task.title}
          </h4>
          <p className="text-slate-400 text-xs line-clamp-2 font-medium leading-relaxed italic">
            {task.description}
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;