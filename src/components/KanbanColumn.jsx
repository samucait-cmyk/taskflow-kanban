import React from 'react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ title, status, tasks, onMove, onDelete, onEdit, colorClass }) {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 min-w-[300px] flex-1 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
          <h3 className="font-bold text-slate-200 text-sm tracking-wide">{title}</h3>
        </div>
        <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full font-semibold">
          {columnTasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
        {columnTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-xl text-center">
            <p className="text-xs text-slate-500">Nenhuma tarefa nesta coluna</p>
          </div>
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}