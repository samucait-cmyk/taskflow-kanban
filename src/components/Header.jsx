export default function Header({ onOpenNewTask }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            TaskFlow Kanban
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gerencie seus projetos com agilidade
          </p>
        </div>
      </div>

      <button
        onClick={onOpenNewTask}
        className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 min-h-[48px]"
      >
        <span className="text-lg font-bold">+</span> Nova Tarefa
      </button>
    </header>
  )
}