import TaskCard from './TaskCard'

export default function KanbanColumn({
  title,
  status,
  color,
  dotColor,
  tasks,
  onEdit,
  onDelete,
  onMove,
  onToggleChecklist,
}) {
  return (
    <section className="w-full md:flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
      <div className={`flex items-center justify-between pb-3 border-b ${color}`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${dotColor}`} />
          <h2 className="font-semibold text-slate-200 text-base">{title}</h2>
        </div>
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-400">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[120px]">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            Nenhuma tarefa aqui
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onToggleChecklist={onToggleChecklist}
            />
          ))
        )}
      </div>
    </section>
  )
}