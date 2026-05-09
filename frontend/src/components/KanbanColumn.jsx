import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

function KanbanColumn({ columnId, title, tasks }) {
  return (
    <div className="w-[320px] flex-shrink-0 flex flex-col h-full max-h-full">
      <div className="flex items-center justify-between px-3 mb-4">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${columnId === 'Graded' ? 'bg-emerald-500' : 'bg-indigo-400'}`}></div>
           <h3 className="font-black text-slate-700 text-[13px] uppercase tracking-wider">{title}</h3>
        </div>
        <span className="bg-slate-200/50 text-slate-600 text-[11px] px-2.5 py-1 rounded-full font-bold">{tasks?.length}</span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto no-scrollbar rounded-[2rem] p-3 transition-all duration-300 ${
              snapshot.isDraggingOver ? 'bg-indigo-50/80 ring-2 ring-indigo-200 ring-dashed' : 'bg-slate-100/40 border border-slate-200/50'
            }`}
          >
            {tasks?.map((task, index) => (
              <KanbanCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;