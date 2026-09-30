import PomodoroTimer from './PomodoroTimer'

export default function Header({
  onNewTask,
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
  selectedPriority,
  setSelectedPriority,
  fontSize,
  setFontSize,
}) {
  return (
    <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl font-extrabold text-lg shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-100 text-base tracking-tight">
                TaskFlow Pro
              </h1>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                Enterprise Agile
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Gestão de Quadros Kanban de Alta Performance
            </p>
          </div>
        </div>

        {/* Filtros, Controlo de Texto e Ações */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Ajuste de Tamanho de Texto */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-1 font-medium">Texto:</span>
            <button
              onClick={() => setFontSize('small')}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                fontSize === 'small' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pequena
            </button>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                fontSize === 'normal' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                fontSize === 'large' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grande
            </button>
          </div>

          {/* Pomodoro Integrado no Topo */}
          <PomodoroTimer />

          {/* Botão Criar Tarefa */}
          <button
            onClick={onNewTask}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <span>+</span> Nova Tarefa
          </button>
        </div>
      </div>
    </header>
  )
}