import React from 'react';

export default function TaskCard({ task, onMove, onDelete, onEdit }) {
  const priorityColors = {
    Baixa: 'bg-slate-700 text-slate-300',
    Média: 'bg-amber-900/60 text-amber-300 border border-amber-700/50',
    Alta: 'bg-rose-950 text-rose-300 border border-rose-800/50',
  };

  const tagColors = {
    Frontend: 'bg-indigo-950 text-indigo-300 border border-indigo-800/50',
    Backend: 'bg-emerald-950 text-emerald-300 border border-emerald-800/50',
    Bug: 'bg-rose-950 text-rose-300 border border-rose-800/50',
    Design: 'bg-purple-950 text-purple-300 border border-purple-800/50',
    Geral: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  const taskTag = task.tag || 'Geral';
  const tagStyle = tagColors[taskTag] || 'bg-cyan-950 text-cyan-300 border border-cyan-800/50';

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'done') return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
  };

  const formattedDate = formatDate(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);

  // Cálculo da checklist / subtarefas
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((sub) => sub.completed).length;
  const totalSubtasks = subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleToggleSubtask = (subId, e) => {
    e.stopPropagation();
    const updatedSubtasks = subtasks.map((sub) =>
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    onEdit(updatedTask); // reutiliza a lógica de salvamento/edição
  };

  return (
    <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/70 rounded-xl p-4 shadow-lg transition-all duration-200 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-slate-100 text-sm leading-snug">{task.title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority] || 'bg-slate-700 text-slate-300'}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>

      {/* Tags e Prazos */}
      <div className="flex items-center flex-wrap gap-2 pt-1">
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${tagStyle}`}>
          🏷️ {taskTag}
        </span>

        {formattedDate && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
              overdue
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60 animate-pulse'
                : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
            }`}
          >
            📅 {formattedDate} {overdue && '⚠'}
          </span>
        )}
      </div>

      {/* Barra de Progresso e Checklist */}
      {totalSubtasks > 0 && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-medium">Checklist</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          
          {/* Barra Visual */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Lista rápida de subtarefas no cartão */}
          <div className="flex flex-col gap-1 pt-1">
            {subtasks.map((sub) => (
              <label
                key={sub.id}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-100"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={(e) => handleToggleSubtask(sub.id, e)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                />
                <span className={`truncate ${sub.completed ? 'line-through text-slate-500' : ''}`}>
                  {sub.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-700/55 mt-1">
        <div className="flex items-center gap-1">
          {task.status !== 'todo' && (
            <button
              onClick={() => onMove(task.id, 'left')}
              title="Mover para trás"
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
            >
              ◀
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onMove(task.id, 'right')}
              title="Mover para frente"
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
            >
              ▶
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            title="Editar tarefa"
            className="px-2 py-1 rounded-lg bg-slate-700/40 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 transition-colors text-xs"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Excluir tarefa"
            className="px-2 py-1 rounded-lg bg-slate-700/40 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 transition-colors text-xs"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}