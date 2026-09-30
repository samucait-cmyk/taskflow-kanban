import { motion, AnimatePresence } from 'framer-motion'

const STATUS_FLOW = ['todo', 'blocked', 'in_progress', 'ready_to_test', 'testing', 'done']

// Função para calcular o status da data limite com alertas coloridos
const getDueDateBadge = (dueDateStr) => {
  if (!dueDateStr) return null

  const today = new Date().toISOString().split('T')[0]
  const due = new Date(dueDateStr + 'T00:00:00')
  const now = new Date(today + 'T00:00:00')
  const diffTime = due - now
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      label: `⚠️ Atrasado (${Math.abs(diffDays)}d)`,
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
    }
  }
  if (diffDays === 0) {
    return {
      label: '⚡ Vence hoje',
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    }
  }
  if (diffDays === 1) {
    return {
      label: '⏳ Vence amanhã',
      style: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    }
  }
  return {
    label: `📅 ${dueDateStr}`,
    style: 'bg-slate-800 text-slate-400 border-slate-700/50',
  }
}

export default function KanbanColumn({
  title,
  status,
  color,
  dotColor,
  tasks,
  allTasks,
  onEdit,
  onDelete,
  onMove,
  onToggleChecklist,
}) {
  const currentIndex = STATUS_FLOW.indexOf(status)

  // Eventos de Drag and Drop para a Coluna
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onMove(taskId, status)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 w-full min-w-[280px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col min-h-[500px] transition-colors"
    >
      {/* Cabeçalho da Coluna */}
      <div className={`flex items-center justify-between pb-3 mb-4 border-b-2 ${color}`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${dotColor} animate-pulse`} />
          <h2 className="font-bold text-slate-200 text-sm sm:text-base">{title}</h2>
        </div>
        <span className="bg-slate-800 text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700/50">
          {tasks.length}
        </span>
      </div>

      {/* Lista de Tarefas Animada */}
      <div className="flex-1 flex flex-col gap-3.5">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/80 rounded-xl p-6 text-center text-slate-500 min-h-[160px]"
            >
              <p className="text-xs sm:text-sm">Arraste tarefas para aqui ou crie uma nova</p>
            </motion.div>
          ) : (
            tasks.map((task) => {
              const completedCount = task.checklist ? task.checklist.filter((c) => c.completed).length : 0
              const totalCount = task.checklist ? task.checklist.length : 0
              const linkedTask = allTasks?.find((t) => t.id === task.linkedTaskId)
              const dueDateBadge = getDueDateBadge(task.dueDate)

              // Evento ao iniciar o arrastamento do cartão
              const handleDragStart = (e) => {
                e.dataTransfer.setData('text/plain', task.id)
              }

              return (
                <motion.div
                  key={task.id}
                  draggable={true}
                  onDragStart={handleDragStart}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 shadow-md hover:shadow-indigo-500/10 transition-colors group cursor-grab active:cursor-grabbing"
                >
                  {/* Cabeçalho do Cartão */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-100 text-sm sm:text-base leading-snug">
                      {task.title}
                    </h3>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md border shrink-0 ${
                        task.priority === 'Alta'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : task.priority === 'Média'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Descrição */}
                  {task.description && (
                    <p className="text-xs sm:text-sm text-slate-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Tag, Data com Alerta e Vínculo */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {task.tag && (
                      <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50 flex items-center gap-1">
                        🏷️ {task.tag}
                      </span>
                    )}
                    {dueDateBadge && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${dueDateBadge.style}`}>
                        {dueDateBadge.label}
                      </span>
                    )}
                    {linkedTask && (
                      <span className="text-[11px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20 flex items-center gap-1">
                        🔗 {linkedTask.title}
                      </span>
                    )}
                  </div>

                  {/* Checklist */}
                  {totalCount > 0 && (
                    <div className="mb-4 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                        <span>Checklist</span>
                        <span>
                          {completedCount}/{totalCount}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {task.checklist.map((item, index) => (
                          <label
                            key={item.id || index}
                            className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => onToggleChecklist(task.id, index)}
                              className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                            />
                            <span
                              className={
                                item.completed ? 'line-through text-slate-500' : ''
                              }
                            >
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rodapé de Ações */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 gap-2">
                    {/* Botões Mover (Mantidos para compatibilidade com telemóveis onde arrastar é mais difícil) */}
                    <div className="flex items-center gap-1">
                      {currentIndex > 0 && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onMove(task.id, STATUS_FLOW[currentIndex - 1])}
                          title="Mover para trás"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          ◀
                        </motion.button>
                      )}
                      {currentIndex < STATUS_FLOW.length - 1 && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onMove(task.id, STATUS_FLOW[currentIndex + 1])}
                          title="Mover para frente"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          ▶
                        </motion.button>
                      )}
                    </div>

                    {/* Editar e Excluir */}
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(task)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Editar
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(task.id)}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/20 transition-colors cursor-pointer"
                      >
                        Excluir
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}