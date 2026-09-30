import { motion, AnimatePresence } from 'framer-motion'

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
    <div className="flex-1 w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col min-h-[500px]">
      {/* Cabeçalho da Coluna */}
      <div className={`flex items-center justify-between pb-3 mb-4 border-b-2 ${color}`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${dotColor} animate-pulse`} />
          <h2 className="font-bold text-slate-200 text-base sm:text-lg">{title}</h2>
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
              <p className="text-xs sm:text-sm">Nenhuma tarefa aqui</p>
            </motion.div>
          ) : (
            tasks.map((task) => {
              const completedCount = task.checklist ? task.checklist.filter((c) => c.completed).length : 0
              const totalCount = task.checklist ? task.checklist.length : 0

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 shadow-md hover:shadow-indigo-500/10 transition-colors group"
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

                  {/* Tag e Data */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {task.tag && (
                      <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50 flex items-center gap-1">
                        🏷️ {task.tag}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700/50 flex items-center gap-1">
                        📅 {task.dueDate}
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
                    {/* Botões Mover */}
                    <div className="flex items-center gap-1">
                      {status !== 'todo' && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            onMove(
                              task.id,
                              status === 'done' ? 'in_progress' : 'todo'
                            )
                          }
                          title="Mover para trás"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                        >
                          ◀
                        </motion.button>
                      )}
                      {status !== 'done' && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            onMove(
                              task.id,
                              status === 'todo' ? 'in_progress' : 'done'
                            )
                          }
                          title="Mover para frente"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
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
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        Editar
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(task.id)}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/20 transition-colors"
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