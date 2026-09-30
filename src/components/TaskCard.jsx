import React from 'react'

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleChecklist,
  onStatusChange 
}) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const priorityColors = {
    Urgente: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    Alta: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Média: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Baixa: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  }

  const checklist = task.checklist || []
  const completedCount = checklist.filter(item => item.completed).length

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md hover:border-slate-700 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3 group"
    >
      {/* Cabeçalho do Cartão */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-100 text-sm leading-snug">
          {task.title}
        </h3>
        {task.priority && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priorityColors[task.priority] || priorityColors.Média}`}>
            {task.priority}
          </span>
        )}
      </div>

      {/* Descrição */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags e Data */}
      <div className="flex flex-wrap items-center gap-2">
        {task.tag && (
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700/50">
            🏷️ {task.tag}
          </span>
        )}
        {task.dueDate && (
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700/50">
            📅 {task.dueDate}
          </span>
        )}
      </div>

      {/* Checklist / Subtarefas */}
      {checklist.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Checklist</span>
            <span>{completedCount}/{checklist.length}</span>
          </div>
          <div className="flex flex-col gap-1">
            {checklist.map((item, idx) => (
              <label 
                key={idx} 
                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleChecklist && onToggleChecklist(task.id, idx)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span className={item.completed ? 'line-through text-slate-500' : ''}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé de Ações do Cartão */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
        <button
          type="button"
          onClick={() => onStatusChange && onStatusChange(task.id, 'in_progress')}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors cursor-pointer"
          title="Iniciar / Mover para Em Andamento"
        >
          ▶️
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-xs font-medium text-rose-300 transition-colors cursor-pointer border border-rose-900/40"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}