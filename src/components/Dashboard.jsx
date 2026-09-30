import { motion } from 'framer-motion'

export default function Dashboard({ tasks }) {
  const total = tasks.length

  const statuses = [
    { key: 'todo', label: 'A Fazer', color: 'bg-amber-500' },
    { key: 'blocked', label: 'Bloqueado', color: 'bg-rose-500' },
    { key: 'in_progress', label: 'Em Andamento', color: 'bg-indigo-500' },
    { key: 'ready_to_test', label: 'Pronto p/ Teste', color: 'bg-blue-500' },
    { key: 'testing', label: 'Em Teste', color: 'bg-purple-500' },
    { key: 'done', label: 'Concluído', color: 'bg-emerald-500' },
  ]

  const stats = statuses.map((s) => {
    const count = tasks.filter((t) => t.status === s.key).length
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0
    return { ...s, count, percentage }
  })

  const completedCount = tasks.filter((t) => t.status === 'done').length
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>📊</span> Dashboard de Indicadores
          </h2>
          <p className="text-xs text-slate-400">Métricas do projeto em tempo real</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Taxa de Conclusão:</span>
          <span className="text-sm font-bold text-emerald-400">{completionRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((item) => (
          <div
            key={item.key}
            className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 truncate">{item.label}</span>
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">{item.count}</span>
              <span className="text-xs font-mono text-slate-400">{item.percentage}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}