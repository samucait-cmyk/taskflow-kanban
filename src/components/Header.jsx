export default function Header({ onNewTask, fontSize, setFontSize }) {
  const sizes = ['14px', '16px', '18px', '20px']

  const decreaseFontSize = () => {
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1])
    }
  }

  const increaseFontSize = () => {
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1])
    }
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>📋</span> TaskFlow Kanban
        </h1>
        <p className="text-sm text-slate-400">Gerencie seus projetos com agilidade</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Controlo de Tamanho de Fonte (A- / A+) */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-sm shadow-inner">
          <button
            onClick={decreaseFontSize}
            className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors font-medium cursor-pointer"
            title="Diminuir fonte"
          >
            A-
          </button>
          <span className="px-2.5 text-slate-400 font-mono text-xs">{fontSize}</span>
          <button
            onClick={increaseFontSize}
            className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors font-medium cursor-pointer"
            title="Aumentar fonte"
          >
            A+
          </button>
        </div>

        {/* Botão Nova Tarefa */}
        <button
          onClick={onNewTask}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 text-sm cursor-pointer active:scale-95"
        >
          <span className="text-base font-bold">+</span> Nova Tarefa
        </button>
      </div>
    </header>
  )
}