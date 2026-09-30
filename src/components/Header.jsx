export default function Header({
  onOpenNewTask,
  fontSize,
  onIncreaseFont,
  onDecreaseFont,
  onResetFont,
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Título e Botões de Fonte no Mobile */}
      <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
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

        {/* Controles de Tamanho de Texto (Visível no Telemóvel à direita) */}
        <div className="flex sm:hidden items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={onDecreaseFont}
            title="Diminuir texto"
            className="px-2 py-1 text-xs font-bold text-slate-300 hover:bg-slate-800 active:scale-95 rounded-lg transition-all"
          >
            A-
          </button>
          <button
            onClick={onResetFont}
            title="Tamanho padrão"
            className="px-1.5 py-1 text-[10px] font-medium text-slate-400 hover:bg-slate-800 rounded-lg transition-all"
          >
            {fontSize}px
          </button>
          <button
            onClick={onIncreaseFont}
            title="Aumentar texto"
            className="px-2 py-1 text-xs font-bold text-slate-300 hover:bg-slate-800 active:scale-95 rounded-lg transition-all"
          >
            A+
          </button>
        </div>
      </div>

      {/* Ações da Direita (Desktop Controles de Fonte + Botão Nova Tarefa) */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Controles de Tamanho de Texto (Visível apenas em Telas Maiores) */}
        <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={onDecreaseFont}
            title="Diminuir texto"
            className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 active:scale-95 rounded-lg transition-all"
          >
            A-
          </button>
          <button
            onClick={onResetFont}
            title="Restaurar tamanho padrão (16px)"
            className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 rounded-lg transition-all"
          >
            {fontSize}px
          </button>
          <button
            onClick={onIncreaseFont}
            title="Aumentar texto"
            className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 active:scale-95 rounded-lg transition-all"
          >
            A+
          </button>
        </div>

        <button
          onClick={onOpenNewTask}
          className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 min-h-[48px]"
        >
          <span className="text-lg font-bold">+</span> Nova Tarefa
        </button>
      </div>
    </header>
  )
}