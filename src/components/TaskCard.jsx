export default function TaskCard({ task, onEdit, onDelete, onMove, onToggleChecklist }) {
  const completedCount = task.checklist ? task.checklist.filter((item) => item.completed).length : 0
  const totalCount = task.checklist ? task.checklist.length : 0

  const priorityColors = {
    Baixa: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Média: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Alta: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }

  return (
    <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-4 flex flex-col gap-3 shadow-md transition-all">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-100 text-sm leading-snug">{task.title}</h3>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
            priorityColors[task.priority] || 'bg-slate-700 text-slate-300'
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {task.tag && (
          <span className="px-2 py-1 rounded-md bg-slate-900/80 text-slate-300 font-medium border border-slate-700/50 flex items-center gap-1 text-[11px]">
            🏷️ {task.tag}
          </span>
        )}
        {task.dueDate && (
          <span className="px-2 py-1 rounded-md bg-slate-900/80 text-slate-400 font-medium border border-slate-700/50 flex items-center gap-1 text-[11px]">
            📅 {task.dueDate}
          </span>
        )}
      </div>

      {/* Checklist */}
      {totalCount > 0 && (
        <div className="mt-1 pt-2 border-t border-slate-700/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Checklist</span>
            <span>
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {task.checklist.map((item, index) => (
              <label
                key={item.id || index}
                className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleChecklist(task.id, index)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className={item.completed ? 'line-through text-slate-500' : ''}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Botões de Ação Adaptados para Toque */}
      <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {task.status !== 'todo' && (
            <button
              onClick={() =>
                onMove(task.id, task.status === 'done' ? 'in_progress' : 'todo')
              }
              title="Mover para esquerda"
              className="p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-lg min-h-[38px] min-w-[38px] flex items-center justify-center active:scale-95"
            >
              ◀
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() =>
                onMove(task.id, task.status === 'todo' ? 'in_progress' : 'done')
              }
              title="Mover para direita"
              className="p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-lg min-h-[38px] min-w-[38px] flex items-center justify-center active:scale-95"
            >
              ▶
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-700 rounded-lg min-h-[38px] active:scale-95"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg min-h-[38px] active:scale-95"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}