import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

function KanbanColumn({ columnId, title, tasks, isTeacherView = false }) {
  const getStatusStyles = (id) => {
    switch (id) {
      case 'To-Do':
        return { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' };
      case 'In-Progress':
        return { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-600 border border-amber-100/50' };
      case 'Submitted':
        return { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-600 border border-blue-100/50' };
      case 'Graded':
        return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' };
      default:
        return { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' };
    }
  };

  const currentStyles = getStatusStyles(columnId);

  return (
    <div className="w-[310px] flex-shrink-0 flex flex-col h-full max-h-full font-['Poppins',sans-serif] text-slate-800 antialiased">
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentStyles.dot}`} />
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">{title}</h3>
        </div>
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-sm ${currentStyles.badge}`}>
          {tasks?.length || 0}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto no-scrollbar rounded-2xl p-3 transition-all duration-300 ${
              snapshot.isDraggingOver 
                ? 'bg-blue-50/40 border border-dashed border-blue-300 shadow-[0_8px_30px_rgba(59,130,246,0.03)]' 
                : 'bg-slate-50/60 border border-slate-100'
            }`}
          >
            <div className="space-y-3">
              {tasks?.map((task, index) => (
                <KanbanCard 
                  key={task._id} 
                  task={task} 
                  index={index} 
                  isTeacherView={isTeacherView} 
                />
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;